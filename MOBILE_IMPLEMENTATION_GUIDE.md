# CommLink Mobile Implementation Guide

This guide details the API contracts, logical flows, and edge cases for the CommLink Mobile Application. It is organized by User Role to ensure clarity on permissions and access.

---

## 🔐 1. Authentication & Common Endpoints

### A. Authentication
All protected endpoints require a Bearer Token in the `Authorization` header.

**1. Register (POST `/api/mobile/auth/register`)** `[USER, PROVIDER]`
- **Payload**:
```json
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "password": "SecurePassword1!",
  "role": "USER",
  "username": "s_connor",
  "phoneNumber": "0971112222",
  "pin": "123456"
}
```
- **Response (201)**: `{ user: {...}, token: "...", expires: "..." }`
- **Errors**: `400` (validation), `409` (duplicate)

**2. Login (POST `/api/mobile/auth/login`)** `[USER, PROVIDER]`
- **Payload**: `{ "email": "...", "password": "..." }`
- **Response (200)**: `{ user: {...}, token: "...", expires: "..." }`
- **Errors**: `401` (invalid credentials)

**3. Forgot Password (POST `/api/mobile/auth/forgot-password`)** `[PUBLIC]`
- **Payload**: `{ "email": "user@example.com" }`
- **Response**: `{ "message": "If an account with that email exists, a recovery code has been sent." }`
- **Note**: In development, `devOtp` is returned for testing.

**4. Verify Code (POST `/api/mobile/auth/verify-code`)** `[PUBLIC]`
- **Payload**: `{ "email": "user@example.com", "code": "123456" }`
- **Response**: `{ "verified": true, "resetToken": "..." }`
- **Errors**: `400` (invalid/expired code)

**5. Reset Password (POST `/api/mobile/auth/reset-password`)** `[PUBLIC]`
- **Payload**:
```json
{
  "email": "user@example.com",
  "resetToken": "...",
  "newPassword": "NewSecurePass1!"
}
```
- **Response**: `{ "message": "Password reset successfully." }`
- **Validation**: Min 8 chars, 1 uppercase, 1 special character.

### B. Common Profile Management

**1. Get My Profile (GET `/api/mobile/profile`)** `[USER, PROVIDER]`
- **Response**: User object with nested `profile` including `interests[]`

**2. Update My Profile (PATCH `/api/mobile/profile`)** `[USER, PROVIDER]`
- **Payload**:
```json
{
  "bio": "Updated bio...",
  "location": "Lusaka",
  "interests": ["Technology", "Mentorship"],
  "isOnline": true,
  "isAvailableForInstant": true
}
```
- **Response**: Updated user object

---

**3. Get KYC Status (GET `/api/kyc/status`)** `[USER, PROVIDER]`
- **Response**:
```json
{
  "status": "APPROVED",
  "kycSubmittedAt": "2026-01-01T10:00:00Z",
  "kycVerifiedAt": "2026-01-02T10:00:00Z",
  "kycRejectionReason": null
}
```

### B. Client (USER) Features

### A. Discovery & Search

**1. Get Categories (GET `/api/categories`)** `[USER, PROVIDER]`
- **Response**: Array of category objects with subcategories

**2. Search Providers (GET `/api/providers/search`)** `[USER]`
- **Query Params**: `q`, `category`, `minPrice`, `maxPrice`
- **Response**: Array of provider objects with services, `isFollowing` (bool), `isFavorite` (bool)

**3. Get Provider Details (GET `/api/providers/[id]`)** `[USER]`
- **Response**: Provider with services, reviews, `isFollowing`, `isFavorite`

**4. Follow Provider (POST/DELETE `/api/providers/[id]/follow`)** `[USER]`
- **Response**: `{ "message": "Followed successfully" }`

**5. Favorite Provider (POST/DELETE `/api/providers/[id]/favorite`)** `[USER]`
- **Response**: `{ "message": "Favorited successfully" }`

**6. Get Following List (GET `/api/mobile/following`)** `[USER]`
- **Response**: Array of provider profiles

**7. Get Favorites List (GET `/api/mobile/favorites`)** `[USER]`
- **Response**: Array of provider profiles

### B. Booking Services

**1. Get Provider Availability (GET `/api/providers/[id]/availability`)** `[USER]`
- **Query Params**: `date` (ISO/YYYY-MM-DD), `days` (default 7)
- **Response**:
```json
{
  "providerId": "prov-123",
  "availability": [
    {
      "date": "2026-10-21",
      "isAvailable": true,
      "slots": ["09:00", "09:30", "13:00", ...]
    }
  ]
}
```

**2. Create Booking (POST `/api/bookings`)** `[USER]`
- **Payload**:
```json
{
  "serviceId": "svc-123",
  "startAt": "2026-02-20T10:00:00Z", // or 'date'
  "duration": 60,
  "notes": "Gate code: 1234",
  "isInstant": false
}
```
- **Response (201)**:
```json
{
  "id": "booking-abc",
  "status": "PENDING",
  "requestedTime": "2026-02-20T10:00:00Z",
  "duration": 60,
  "price": 150.00,
  "notes": "Gate code: 1234",
  "isInstant": false,
  "client": {
    "id": "user-123",
    "name": "John Doe",
    "image": "https://...",
    "email": "john@example.com"
  },
  "service": {
    "id": "svc-123",
    "title": "Consultation",
    "price": 150.00,
    "duration": 60,
    "category": "Consulting",
    "provider": {
      "id": "provider-456",
      "name": "Jane Provider",
      "image": "https://...",
      "email": "jane@provider.com",
      "profile": {
        "headline": "Expert Consultant",
        "isVerified": true
      }
    }
  }
}
```

**3. Get My Bookings (GET `/api/bookings`)** `[USER, PROVIDER]`
- **Response**: Array of bookings (same structure)

**4. Reschedule Booking (PATCH `/api/bookings/[id]/reschedule`)** `[USER, PROVIDER]`
- **Payload**:
```json
{
  "requestedTime": "2026-02-21T14:00:00Z",
  "reason": "Conflict with another appointment"
}
```
- **Response**: `{ "message": "Reschedule request submitted. Awaiting provider approval.", "booking": {...} }`
- **Note**: Resets booking status to `PENDING` for re-approval.

**5. Respond to Booking (POST `/api/bookings/[id]/respond`)** `[PROVIDER]`
- **Accept Booking**:
```json
{ "status": "accepted" }
```
- **Decline Booking**:
```json
{ "status": "declined" }
```
- **Suggest Alternative Time**:
```json
{
  "status": "suggest_alternative",
  "suggestedTime": "2026-02-22T09:00:00Z"
}
```
- **Note**: `suggest_alternative` keeps status as `PENDING` with updated time for client review.


### C. Wallet & Payments

**1. Get Wallet (GET `/api/wallet`)** `[USER, PROVIDER]`
- **Response**: Wallet with `balance`, `availableMinutes`, purchases, usage

**2. Purchase Minutes (POST `/api/wallet/purchase`)** `[USER]`
- **Payload**: `{ "packageId": "pkg-1", "paymentMethod": "MOBILE_MONEY" }`

---

## 🛠 3. Service Provider (PROVIDER) Features

### A. Dashboard & Earnings

**1. Get Earnings (GET `/api/provider/earnings`)** `[PROVIDER]`
- **Response**:
```json
{
  "totalMinutesServiced": 1200,
  "currentMonthMinutes": 300,
  "pendingPayoutZMW": 500,
  "totalEarningsZMW": 1500,
  "minutesGrowthPercent": 12.5
}
```

**2. Get Analytics (GET `/api/provider/analytics`)** `[PROVIDER]`
- **Query Params**: `range` (7d, 30d, 90d)
- **Response**:
```json
{
  "completion": { "value": 98.4, "change": 2.1, "trend": "up" },
  "retention": { "value": 75, "change": -0.5, "trend": "down" },
  "rating": 4.9,
  "reviewCount": 128,
  "totalDuration": 1240,
  "newClients": 24,
  "weeklySessions": [{ "day": "MON", "count": 5 }, ...],
  "ratingBreakdown": [{ "stars": 5, "percentage": 90 }, ...]
}
```

### B. Service Management (Full CRUD)

**1. Get My Services (GET `/api/services`)** `[PROVIDER]`
- **Response**: Array of service objects

**2. Create Service (POST `/api/services`)** `[PROVIDER]`
- **Payload**:
```json
{
  "title": "One-on-One Consultation",
  "description": "45-minute personalized consultation...",
  "price": 150.00, // Optional (null/undefined allowed)
  "duration": 45, // Optional (null/undefined allowed)
  "category": "Consulting" // Defaults to "General" if omitted
}
```
- **Response (201)**:
```json
{
  "id": "svc-abc123",
  "providerId": "user-provider-id",
  "createdById": "user-creator-id",
  "title": "One-on-One Consultation",
  "description": "45-minute personalized consultation...",
  "price": 150.00,
  "duration": 45,
  "category": "Consulting",
  "isActive": true,
  "isApproved": false,
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T10:00:00Z"
}
```
- **Note**: New services are created with `isApproved: false` and require Admin approval before appearing in search results.
- **Errors**: `401` (unauthorized), `400` (validation)

**3. Get Service Details (GET `/api/services/[id]`)** `[USER, PROVIDER]`
- **Response**: Service object with provider

**4. Update Service (PATCH `/api/services/[id]`)** `[PROVIDER]`
- **Payload**: Any subset of create fields
- **Errors**: `403` (not owner), `404` (not found)

**5. Delete Service (DELETE `/api/services/[id]`)** `[PROVIDER]`
- **Response**: `{ "message": "Service deleted successfully" }`

### C. Session History

**1. Get Sessions (GET `/api/sessions`)** `[USER, PROVIDER]`
- **Query Params**: `status` (ALL, COMPLETED, CANCELLED), `limit`, `offset`
- **Response**:
```json
[
  {
    "id": "sess-789",
    "clientName": "Robert Fox",
    "clientImage": "...",
    "service": "Video Consultation",
    "date": "2026-01-16T14:00:00Z",
    "durationMinutes": 45,
    "status": "COMPLETED"
  }
]
```

### D. Booking Management

**1. Respond to Booking (POST `/api/bookings/[id]/respond`)** `[PROVIDER]`
- **Payload**: `{ "status": "accepted" }` or `{ "status": "declined" }`
- **Note**: Accepted bookings create `AppSession`

---


### E. Communication & Notifications

**1. Register Device (POST `/api/notifications/register`)** `[USER, PROVIDER]`
- **Payload**: `{ "token": "device-push-token", "platform": "ios" }`
- **Response**: `{ "message": "Device registered" }`

**2. Get Notifications (GET `/api/notifications`)** `[USER, PROVIDER]`
- **Query Params**: `page`, `limit`, `unreadOnly=true`
- **Response**: `{ "notifications": [...], "meta": {...} }`

**3. Mark Read (PATCH `/api/notifications/[id]/read`)** `[USER, PROVIDER]`
- **Response**: `{ "success": true }`

**4. Get Chat Messages (GET `/api/chat/[sessionId]`)** `[USER, PROVIDER]`
- **Response**: Array of message objects.
- **Note**: Chat is linked to an `AppSession`.

**5. Send Message (POST `/api/chat/[sessionId]`)** `[USER, PROVIDER]`
- **Payload**: `{ "content": "Hello world" }`
- **Response**: Message object.

---

### F. Post-Session & Safety

**1. Create Review (POST `/api/sessions/[sessionId]/review`)** `[USER]`
- **Payload**: `{ "rating": 5, "comment": "Great session!" }`
- **Response**: Review object.

**2. Report Dispute (POST `/api/sessions/[sessionId]/dispute`)** `[USER, PROVIDER]`
- **Payload**: `{ "reason": "Provider did not show up", "description": "..." }`
- **Response**: Dispute object.

---

## 🛡 4. Admin (ADMIN) Features


*Admin features are primarily web-based.*

---

## Error Handling

All endpoints return consistent error format:
```json
{ "message": "Error description" }
```

| Status | Meaning |
|:-------|:--------|
| 400 | Bad Request (validation) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (wrong role/owner) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Server Error |
