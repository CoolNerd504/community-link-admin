# Comprehensive Mobile Implementation Guide & API Schema

This document details the exact API contracts, logical flows, and edge cases for the CommLink Mobile Application. Developers should follow these schemas strictly.

---

## 🔐 1. Authentication & Onboarding

### A. Register User
**Intent:** Create a new account.
**Endpoint:** `POST /api/auth/register`

#### Scenario 1: Successful Registration (Client)
**Request Payload:**
```json
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "password": "SecurePassword1!", // Must be >8 chars, 1 Upper, 1 Special
  "role": "USER",
  "username": "s_connor", // Alphanumeric, 3-20 chars
  "phoneNumber": "0971112222",
  "pin": "123456" // Exactly 6 digits
}
```
**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "userId": "cm3uuid-string-123"
}
```

#### Scenario 2: Validation Failure (Invalid PIN)
**Request Payload:** `{"pin": "123"}` (Too short)
**Response (400 Bad Request):**
```json
{
  "message": "PIN must be exactly 6 digits"
}
```

#### Scenario 3: Conflict (Duplicate Data)
**Request Payload:** Existing email or phone.
**Response (409 Conflict):**
```json
{
  "message": "Email already registered"
}
```

---

### B. Login
**Intent:** Authenticate and retrieve session token.
**Pre-requisite:** You MUST fetch a CSRF token first.
1. **Endpoint:** `GET /api/auth/csrf`
2. **Response:** `{"csrfToken": "e580..."}`
3. **Use:** Include this token in the Login POST body.

**Endpoint:** `POST /api/auth/callback/credentials`

#### Scenario 1: Success
**Request Payload:**
```json
{
  "email": "sarah@example.com",
  "password": "SecurePassword1!",
  "otp": "123456", // If 2FA enabled
  "csrfToken": "e580...", // REQUIRED from GET /api/auth/csrf
  "redirect": false
}
```
**Response (200 OK):**
```json
{
  "user": {
    "id": "cm3uuid-string-123",
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "role": "USER",
    "username": "s_connor",
    "kycStatus": "PENDING"
  },
  "expires": "2026-02-14T10:00:00.000Z"
}
```

#### Scenario 2: Invalid Credentials
**Response (401 Unauthorized):** `{"message": "Invalid email or password"}` (Note: NextAuth often returns 200 with `error` or 401 depending on config, but standard REST should is 401).

---

## 🔍 2. Discovery (Search Providers)
**Intent:** Find service providers based on criteria.
**Endpoint:** `GET /api/providers/search`

#### Scenario 1: Filtered Search
**Request:** `GET /api/providers/search?q=Plumber&category=Maintenance&minPrice=100`

**Response (200 OK):**
```json
[
  {
    "id": "prov-001",
    "name": "Mario Bros",
    "image": "https://s3.bucket/mario.jpg",
    "rating": 4.9,
    "reviewCount": 150,
    "profile": {
      "headline": "Expert Plumbing & Heating",
      "location": "Lusaka",
      "isVerified": true
    },
    "services": [
      {
        "id": "svc-101",
        "title": "Pipe Repair",
        "price": 500,
        "duration": 60,
        "category": "Maintenance"
      }
    ]
  }
]
```

#### Scenario 2: No Results
**Response (200 OK):** `[]` (Empty Array) - *Mobile App should handle this by showing "No providers found" illustration.*

---

## 🛠 3. Service Management (Provider)
**Intent:** Provider adds a new service offering.
**Endpoint:** `POST /api/services`

#### Scenario 1: Create Service Successfully
**Request Payload:**
```json
{
  "title": "Full House Cleaning",
  "description": "Deep cleaning of up to 3 bedrooms including windows.",
  "price": 450.00,
  "duration": 120, // Minutes
  "category": "Home Services"
}
```
**Response (201 Created):**
```json
{
  "id": "svc-new-123",
  "providerId": "prov-001",
  "title": "Full House Cleaning",
  "isActive": true,
  "createdAt": "2026-01-16T10:00:00.000Z"
}
```

#### Scenario 2: Validation Error (Missing Desc)
**Request:** `{"title": "Test"}`
**Response (400 Bad Request):** `{"message": "Description is required"}`

---

## 📅 4. Booking Flow

### A. Create Request (Client)
**Intent:** Client requests a session.
**Endpoint:** `POST /api/bookings`

#### Scenario 1: Schedule a Session
**Request Payload:**
```json
{
  "providerId": "prov-001",
  "serviceId": "svc-101",
  "date": "2026-01-20T14:00:00Z", // ISO Date
  "notes": "Gate code is 1234. Please bring own tools."
}
```
**Response (201 Created):**
```json
{
  "id": "bk-789",
  "status": "PENDING",
  "service": { "title": "Pipe Repair" },
  "client": { "name": "Sarah Connor" }
}
```

### B. Respond to Request (Provider)
**Intent:** Provider Accepts or Declines.
**Endpoint:** `POST /api/bookings/{id}/respond`

#### Scenario 1: Accept
**Request Payload:**
```json
{
  "status": "accepted" // Case sensitive enum: 'accepted', 'declined'
}
```
**Response (200 OK):**
```json
{
  "id": "bk-789",
  "status": "ACCEPTED",
  "updatedAt": "..."
}
```

---

## 💰 5. Wallet & Payouts (Provider)

### A. Request Payout
**Intent:** Withdraw earnings to bank/mobile money.
**Endpoint:** `POST /api/wallet/payout`

#### Scenario 1: Successful Request
**Pre-condition:** Balance >= Amount.
**Request Payload:**
```json
{
  "amount": 500.00,
  "bankDetails": "Airtel Money: 097-xxx-xxxx"
}
```
**Response (200 OK):**
```json
{
  "id": "payout-001",
  "amount": 500.00,
  "status": "PENDING",
  "message": "Payout request submitted."
}
```

#### Scenario 2: Insufficient Funds
**Request:** Amount = 5000 (Balance = 100).
**Response (400 Bad Request):**
```json
{
  "message": "Insufficient funds. Available balance: 100.00"
}
```

---

## 👤 6. Profile & KYC

### A. Submit KYC Documents
**Intent:** Provider uploads ID for verification.
**Endpoint:** `POST /api/kyc/submit`

#### Scenario 1: Submission
**Request Payload:**
```json
{
  "idFront": "https://storage.googleapis.com/.../front.jpg", // Pre-signed URLs or Base64 (prefer URL)
  "idBack": "https://storage.googleapis.com/.../back.jpg",
  "selfie": "https://storage.googleapis.com/.../selfie.jpg"
}
```
**Response (200 OK):**
```json
{
  "status": "SUBMITTED",
  "kycSubmittedAt": "2026-01-16T10:30:00Z"
}
```

### B. Update Profile
**Intent:** User updates bio/headline.
**Endpoint:** `PATCH /api/profile/me`

#### Scenario 1: Update Intro
**Request Payload:**
```json
{
  "headline": "Certified Expert Electrician",
  "bio": "10 years of experience in high voltage systems...",
  "languages": ["English", "Bemba"]
}
```

---

## ⭐️ 7. Reviews & Ratings

### A. Create Review
**Intent:** Client reviews a completed session.
**Endpoint:** `POST /api/reviews`

#### Scenario 1: Success
**Request Payload:**
```json
{
  "sessionId": "sess_123",
  "rating": 5, // 1-5 integer
  "comment": "Excellent service, very professional."
}
```
**Response (201 Created):**
```json
{
  "id": "rev_999",
  "createdAt": "2026-01-20T..."
}
```

---

## 💬 8. Chat & Messaging

### A. Send Message
**Intent:** Send a text message in an active session.
**Endpoint:** `POST /api/chat/messages`

#### Scenario 1: Sending
**Request Payload:**
```json
{
  "chatRoomId": "room_xyz",
  "content": "I am arriving in 5 minutes."
}
```
**Response (201 Created):** `{"id": "msg_456", "isRead": false}`

### B. Get Messages
**Intent:** Poll for new messages (or initial load).
**Endpoint:** `GET /api/chat/{chatRoomId}/messages`
**Response (200 OK):**
```json
[
  {
    "id": "msg_455",
    "senderId": "user_1",
    "content": "Hello?",
    "createdAt": "..."
  }
]
```

---

## 🔔 9. Notifications

### A. Get Notifications
**Intent:** Fetch recent alerts (Bookings, Payouts).
**Endpoint:** `GET /api/notifications`
**Response (200 OK):**
```json
[
  {
    "id": "notif_001",
    "type": "BOOKING_REQUEST",
    "title": "New Booking",
    "message": "Sarah requested a session.",
    "isRead": false,
    "data": { "bookingId": "bk-789" }
  }
]
```
