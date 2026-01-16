# Auth & KYC Setup Guide

This guide outlines the implementation of a secure Authentication and Know Your Customer (KYC) system, typically used in fintech applications. It mirrors the architecture found in the `PayFlowAdmin` project.

## 1. System Overview

The system provides:
-   **Mobile-first Authentication**: supports PIN, Password, and Biometric (Fingerprint/FaceID) login.
-   **Secure Registration**: Validates phone numbers and strong passwords, and initializes user wallets.
-   **KYC Compliance**: Multi-stage document upload (ID Front/Back, Selfie, Proof of Address) with Admin verification.
-   **Forensic Logging**: Tracks device info, location, and IP for security auditing.

## 2. Prerequisites & Environment

Ensure the following environment variables are configured:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/db"

# Security
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"
PIN_SALT_ROUNDS=12

# Storage (Firebase Example)
FIREBASE_PROJECT_ID="your-project"
FIREBASE_CLIENT_EMAIL="service-account@..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY..."
FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
```

**Dependencies:**
-   `bcryptjs`: For hashing passwords and PINs.
-   `jsonwebtoken`: For generating stateless auth tokens.
-   `multer`: For handling multipart file uploads.
-   `firebase-admin` (or AWS SDK): For cloud storage of KYC documents.
-   `prisma`: ORM for database interactions.

## 3. Database Schema

The core models required are `MobileUser` and `MobileWallet`.

> [!NOTE]
> This schema uses Prisma format.

### User Model
```prisma
model MobileUser {
  id            String    @id @default(uuid())
  fullName      String
  username      String    @unique
  phoneNumber   String    @unique
  email         String?   @unique
  
  // Auth Secrets
  passwordHash  String?   // For strong password auth
  pinHash       String    // For quick access (6-digit)
  
  // Status
  isActive      Boolean   @default(true)
  phoneVerified Boolean   @default(false)
  emailVerified Boolean   @default(false)

  // Biometric Flags
  biometricEnabled    Boolean   @default(false)
  lastLoginMethod     String?   // 'pin', 'password', 'fingerprint', 'face_id'

  // KYC Information
  kycStatus         String    @default("PENDING") // PENDING, SUBMITTED, VERIFIED, REJECTED
  kycSubmittedAt    DateTime?
  kycVerifiedAt     DateTime?
  kycRejectionReason String?
  
  // KYC Documents (Direct Links)
  idFrontUrl        String?
  idBackUrl         String?
  idFrontVerified   Boolean @default(false)
  idBackVerified    Boolean @default(false)
  selfieUrl         String?
  proofOfAddressUrl String?
  
  // Security Metadata
  deviceId        String?
  deviceOs        String?
  lastIpAddress   String?
  lastLocation    String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  wallet        MobileWallet?
}
```

### Wallet Model
```prisma
model MobileWallet {
  id               String   @id @default(uuid())
  userId           String   @unique
  user             MobileUser @relation(fields: [userId], references: [id])
  
  totalBalance     Decimal  @default(0)
  availableBalance Decimal  @default(0)
  currency         String   @default("ZMW")
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

## 4. Authentication Implementation

### A. Registration Flow
1.  **Input Validation**:
    -   `username`: Alphanumeric, 3-20 chars.
    -   `password`: Regex for strong password (uppercase, lowercase, number, special char).
    -   `pin`: Exactly 6 digits.
    -   `phoneNumber`: Normalize using `libphonenumber-js`.
2.  **Uniqueness Check**: Ensure username, phone, and email are unique.
3.  **Hashing**:
    ```typescript
    const pinHash = await bcrypt.hash(pin, 12);
    const passwordHash = await bcrypt.hash(password, 12);
    ```
4.  **Transaction**: Create User + Wallet + Settings atomically.
5.  **Token Generation**: Issue JWT.

### B. Login Flow
Support multiple methods via a flexible `authenticate` endpoint.

```typescript
// Pseudocode for Login Service
async function login(data: LoginData) {
  const user = await findUserByIdentifier(data.identifier);
  
  if (data.authMethod === 'password') {
    if (!await bcrypt.compare(data.password, user.passwordHash)) throw Error('Invalid password');
  } else if (data.authMethod === 'pin') {
    if (!await bcrypt.compare(data.pin, user.pinHash)) throw Error('Invalid PIN');
  }
  
  // Update forensics (IP, Device ID)
  await updateUserSecurityStats(user.id, data);
  
  return generateToken(user);
}
```

## 5. KYC Implementation

### A. Document Upload
Use a dedicated service to handle uploads to object storage (Firebase/S3).

**Components:**
1.  **Multer Middleware**: Filter for images (JPEG/PNG/WebP), limit 5MB.
2.  **Upload Service**:
    -   Upload file to unique path (e.g., `kyc/{uuid}.jpg`).
    -   Get public access URL.
    -   Update `MobileUser` record (e.g., set `idFrontUrl`).
    -   **Auto-Update Status**: If all docs are present, set `kycStatus` to `SUBMITTED`.

### B. Verification Flow
Administrative endpoints are required to approve/reject documents.

-   **Verify**:
    -   Input: `userId`, `verdict: true`.
    -   Action: Set `kycStatus = 'VERIFIED'`, `kycVerifiedAt = now()`.
-   **Reject**:
    -   Input: `userId`, `verdict: false`, `reason: string`.
    -   Action: Set `kycStatus = 'REJECTED'`, `kycRejectionReason = reason`.
    -   Specific Rejection: Can reject individual docs (e.g., `idFrontRejectionReason`) to prompt re-upload of just that file.

## 6. User Profile Structure

The user profile returned to the client should be sanitized (no hashes).

```json
{
  "id": "uuid-string",
  "fullName": "John Doe",
  "username": "jdoe",
  "phoneNumber": "+260970000000",
  "email": "john@example.com",
  "avatar": "https://...",
  "status": {
    "isActive": true,
    "phoneVerified": true,
    "emailVerified": false
  },
  "security": {
    "biometricEnabled": true,
    "lastLoginMethod": "face_id"
  },
  "kyc": {
    "status": "VERIFIED", // PENDING, SUBMITTED, VERIFIED, REJECTED
    "documents": {
      "ID_FRONT": { "status": "VERIFIED", "url": "..." },
      "ID_BACK": { "status": "VERIFIED", "url": "..." },
      "SELFIE": { "status": "VERIFIED", "url": "..." }
    }
  }
}
```

## 7. Security Best Practices

> [!IMPORTANT]
> **Forensic Logging**: Always capture `ipAddress`, `deviceId`, and `location` on login and sensitive transactions to build a risk profile.

-   **Normalization**: Always normalize phone numbers to E.164 and usernames to lowercase before database queries.
-   **Atomic Operations**: Use database transactions when creating User/Wallet pairs to prevent orphaned records.
-   **Input Sanitization**: Strictly validate all inputs using a library like `zod` or `express-validator`.
