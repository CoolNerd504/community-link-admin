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

## 👤 2. Client (USER) Features

### A. Discovery & Search

**1. Get Categories (GET `/api/categories`)** `[USER, PROVIDER]`
- **Response**: Array of category objects with subcategories

**2. Search Providers (GET `/api/providers/search`)** `[USER]`
- **Query Params**: `q`, `category`, `minPrice`, `maxPrice`
- **Response**: Array of provider objects with services

**3. Get Provider Details (GET `/api/providers/[id]`)** `[USER]`
- **Response**: Provider with services and reviews

### B. Booking Services

**1. Create Booking (POST `/api/bookings`)** `[USER]`
- **Payload**:
```json
{
  "serviceId": "svc-123",
  "date": "2026-02-20T10:00:00Z",
  "duration": 60,
  "notes": "Gate code...",
  "isInstant": false
}
```
- **Response (201)**: Booking object

**2. Get My Bookings (GET `/api/bookings`)** `[USER, PROVIDER]`
- **Response**: Array of booking objects

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
- **Payload**: `{ "title", "description", "price", "duration", "category" }`
- **Response (201)**: Service object

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
