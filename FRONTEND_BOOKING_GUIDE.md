# Frontend Booking Integration Guide

This guide details the API endpoints required to implement the "Book a Session" flow.

## 1. Provider Availability
**Purpose**: Fetch communicating slots for the booking calendar.

**Endpoint**: `GET /api/providers/[id]/availability`
- **Auth**: Required (USER)
- **Query Params**:
  - `date`: ISO Date String or `YYYY-MM-DD` (Start date)
  - `days`: Number of days to fetch (Default: 7)

**Request Example**:
`GET /api/providers/user-123/availability?date=2026-02-20&days=3`

**Response**:
```json
{
  "providerId": "user-123",
  "availability": [
    {
      "date": "2026-02-20",
      "isAvailable": true,
      "slots": [
        "09:00", "09:30", "10:00", "14:00", "14:30"
      ]
    },
    {
      "date": "2026-02-21",
      "isAvailable": false,
      "slots": [] 
    }
    // ...
  ]
}
```

---

## 2. Create Booking
**Purpose**: Submit a booking request.

**Endpoint**: `POST /api/bookings`
- **Auth**: Required (USER)

**Payload**:
```json
{
  "serviceId": "svc-abc-123",
  "startAt": "2026-02-20T09:00:00Z", // ISO Timestamp of selected slot
  "duration": 60, // Duration in minutes
  "notes": "Please focus on React hooks.",
  "isInstant": false // Set true only if Instant Booking logic applies
}
```

**Response (201 Created)**:
```json
{
  "id": "bk-xyz-789",
  "status": "PENDING", // Initial status
  "requestedTime": "2026-02-20T09:00:00.000Z",
  "duration": 60,
  "price": 100.00,
  "client": {
     "id": "user-client-id",
     "name": "Client Name"
  },
  "service": {
     "title": "React Mentorship",
     "provider": {
        "id": "user-provider-id",
        "name": "Provider Name"
     }
  }
}
```

---

## 3. My Bookings
**Purpose**: List user's bookings.

**Endpoint**: `GET /api/bookings`
- **Auth**: Required (USER or PROVIDER)
- **Response**: Array of booking objects (same structure as above).

---

## 4. Reschedule Booking
**Purpose**: Request a new time for an existing booking.

**Endpoint**: `PATCH /api/bookings/[id]/reschedule`
- **Auth**: Required (Owner of booking)

**Payload**:
```json
{
  "requestedTime": "2026-02-22T14:00:00Z", // New ISO Timestamp
  "reason": "Conflict with work meeting"
}
```
**Note**: Uses `requestedTime` key, not `startAt`.

**Response (200 OK)**:
```json
{
  "message": "Reschedule request submitted...",
  "booking": { ... } // Status resets to PENDING
}
```

---

## 5. Respond to Booking (Provider)
**Purpose**: Accept, Decline, or Propose Alternative.

**Endpoint**: `POST /api/bookings/[id]/respond`
- **Auth**: Required (PROVIDER)

**Payload Options**:

**A. Accept**:
```json
{ "status": "accepted" }
```
*Effect*: Creates an active `AppSession`.

**B. Decline**:
```json
{ "status": "declined" }
```
*Effect*: Marks booking as DECLINED.

**C. Propose Alternative**:
```json
{
  "status": "suggest_alternative",
  "suggestedTime": "2026-02-22T10:00:00Z"
}
```
*Effect*: Status remains PENDING; notifies client of suggestion.
