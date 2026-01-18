# Booking Flow Backend Implementation Guide

This document outlines the backend requirements to support the "Book a Session" flow from the Provider Profile screen in the mobile app.

## Overview of the Flow
1.  **Select Service**: User picks a service from the provider's list (Visualized in App, data from `GET /api/providers/{id}`).
2.  **Select Date & Time**: User picks a date and time slot. **(REQUIRES NEW API)**
3.  **Review & Confirm**: User reviews details and confirms via payment or booking request. **(REQUIRES EXISTING API)**

---

## 1. Availability API (New Requirement)
To replace the mock calendar and time slots in Step 2 of the modal, we need an endpoint to fetch a provider's available slots.

### Endpoint: Get Provider Availability
**GET** `/api/providers/:providerId/availability`

#### Query Parameters
- `date`: ISO Date String (e.g., `2026-10-21`) - The focal date or start of range.
- `days`: Number (default `1` or `7`) - How many days of availability to return.
- `serviceId`: String (Optional) - To check against specific service duration constraints.

#### Response (200 OK)
```json
{
  "providerId": "prov-123",
  "availability": [
    {
      "date": "2026-10-21",
      "isAvailable": true,
      "slots": [
        "09:00", "09:30", "10:00", "10:30", 
        "13:00", "13:30", "14:00", "14:30", "15:00"
      ]
    },
    {
      "date": "2026-10-22",
      "isAvailable": true,
      "slots": [
        "09:00", "10:00" // Example of limited slots
      ]
    }
  ]
}
```

#### Logic Requirements
- **Block Booked Slots**: Exclude times where the provider already has a `CONFIRMED` or `PENDING` booking.
- **Provider Schedule**: Only show slots within the provider's defined working hours (e.g., Mon-Fri, 9am-5pm).
- **Buffer Time**: (Optional) Ensure there is a buffer (e.g., 5-15 mins) between sessions if required.

---

## 2. Booking Creation API
This connects to the "Request Booking" button in Step 3.

### Endpoint: Create Booking
**POST** `/api/bookings`

#### Payload
```json
{
  "serviceId": "svc-123",
  "providerId": "prov-123", // Can be inferred from serviceId if unique, but explicit is safer
  "startAt": "2026-10-21T09:00:00.000Z", // Full ISO timestamp of selected slot
  "duration": 45, // Duration in minutes (User can select custom duration)
  "notes": "Gate code is 1234. Please be on time."
}
```

#### Response (201 Created)
```json
{
  "id": "bk-789",
  "status": "PENDING", // Initial status
  "requestedTime": "2026-10-21T09:00:00.000Z",
  "duration": 45,
  "price": 67.50, // Calculated by backend based on service rate * duration
  "service": {
    "title": "Consultation"
  },
  "client": {
    "name": "Sarah Connor"
  }
}
```

#### Logic Requirements
- **Validation**: Ensure `startAt` is in the future and slot is still available.
- **Price Calculation**: Calculate final price server-side: `(Service Price / Service Duration) * Requested Duration`.
- **Notification**: Trigger a `BOOKING_REQUEST` notification to the Provider (via `notificationService`).

---

## 3. Integration Checklist for Mobile Dev
To fully enable this flow on the frontend:

- [ ] **Data Fetching**: Update `BookingFlowModal` Step 2 to fetch from `/api/providers/{id}/availability` when a date is selected, instead of using the hardcoded `['9:00 AM', ...]`.
- [ ] **State Management**: Ensure `selectedDate` + `timeSlot` are combined into a valid ISO string for `startAt`.
- [ ] **API Call**: Implement the `onConfirm` handler in `ProviderProfile.tsx` (or passed to modal) to call `bookingService.createBooking(...)`.
- [ ] **Error Handling**: Handle 409 Conflict (Slot taken) or 400 Bad Request errors gracefully in the UI.

---

## 4. Wallet/Payment (Future Scope)
If bookings require immediate payment:
1.  **Check Balance**: Before `POST /api/bookings`, check `GET /api/wallet`.
2.  **Insufficient Funds**: Show "Top Up" flow if balance < estimated price.
3.  **Deduct**: Backend handles deduction transaction atomically with booking creation.
