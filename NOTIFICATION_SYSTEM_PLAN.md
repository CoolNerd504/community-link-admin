# Notification System Implementation Guide

## Overview
This document details the Notification System implemented to support feature-categorized push notifications and an in-app notification center.

## 1. Database Schema

### Notification Model
Stores the history of notifications for the user's "Inbox".
```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  type      NotificationType // Enum
  title     String
  body      String           // The message content
  data      Json?            // Metadata (e.g. { bookingId: "..." })
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
}
```

### Device Model
Stores Push Tokens (FCM/Expo) for delivering notifications to devices.
```prisma
model Device {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String   // Unique push token
  platform  String?  // "ios" | "android" | "web"
  updatedAt DateTime @updatedAt
  
  @@unique([userId, token])
}
```

### NotificationType Enum
- `BOOKING_REQUEST` (Blue Icon)
- `BOOKING_CONFIRMED` (Green Icon?)
- `SESSION_REMINDER` (Purple Icon?)
- `MISSED_CALL` (Red Icon)
- `PAYMENT_SUCCESS`
- `PAYMENT_FAILED`
- `SYSTEM`

---

## 2. Frontend API Reference

### A. Register Device Token
Call this when the app launches or the user logs in to register their device for push notifications.

- **Endpoint**: `POST /api/notifications/register`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**:
```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "platform": "ios" // or "android"
}
```
- **Response (200)**:
```json
{
  "message": "Device registered successfully",
  "device": { ... }
}
```

### B. Get Notifications
Fetch the list of notifications for the Notification Center screen.

- **Endpoint**: `GET /api/notifications`
- **Query Params**:
  - `page`: Page number (default 1)
  - `limit`: Items per page (default 20)
  - `unreadOnly`: Set `true` to fetch only unread items.
- **Response (200)**:
```json
{
  "notifications": [
    {
      "id": "notif-123",
      "type": "BOOKING_REQUEST",
      "title": "New Booking Request",
      "body": "Sarah sent a request for...",
      "isRead": false,
      "createdAt": "2026-01-18T10:00:00Z",
      "data": { "bookingId": "bk-123" }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### C. Mark Notification as Read
Call this when the user taps on a specific notification or views it.

- **Endpoint**: `PATCH /api/notifications/[id]/read`
- **Response (200)**:
```json
{
  "notification": { "id": "notif-123", "isRead": true, ... }
}
```

### D. Mark All as Read
For the "Mark all as read" button in the UI.

- **Endpoint**: `POST /api/notifications/mark-all-read`
- **Response (200)**:
```json
{
  "message": "All notifications marked as read"
}
```

---

## 3. Backend Integration (Service)

A helper service is available at `lib/notifications.ts` to trigger notifications from backend logic.

```typescript
import { sendNotification } from '@/lib/notifications'
import { NotificationType } from '@prisma/client'

await sendNotification({
    userId: "target-user-id",
    type: NotificationType.SYSTEM,
    title: "Alert Title",
    body: "Alert message",
    data: { foo: "bar" } // Optional
})
```

**Currently Hooked Events:**
1.  **New Booking**: Triggers `BOOKING_REQUEST` to Provider.
2.  **Booking Response**: Triggers `BOOKING_CONFIRMED`, `BOOKING_REQUEST` (Alternative Time), or `SYSTEM` (Declined) to Client.
