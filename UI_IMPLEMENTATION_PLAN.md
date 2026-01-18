# Web UI Implementation Plan

This plan details the steps to "flesh out" the web UI to consume the new Mobile/API endpoints, ensuring parity between Web and Mobile features.

## 1. Booking Flow (Critical)
**Current State**: `BookingWizard.tsx` allows selecting *any* future date and any time manually.
**Target State**: Limit selection to available slots fetched from API.

### Actions:
- [ ] **Fetch Availability**: In `BookingWizard`, call `GET /api/providers/[id]/availability` when the calendar month changes or on load.
- [ ] **Disable Dates**: Pass `disabled` modifiers to the `<Calendar />` component for dates with `isAvailable: false`.
- [ ] **Slot Selection**: Replace the generic `type="time"` input with a Grid of Buttons showing available slots (e.g., "09:00", "09:30").
- [ ] **Validation**: Ensure `startAt` in payload matches a valid slot.

## 2. Client Dashboard (`/dashboard`)
**Current State**: Shows "Provider Discovery" (Search) only.
**Target State**: Comprehensive Client Portal.

### Actions:
- [ ] **Add "My Bookings" Tab**:
    -   Fetch bookings via `GET /api/bookings`.
    -   Show list of Pending, Confirmed, Completed bookings.
    -   Add "Reschedule" and "Join Session" buttons.
- [ ] **Notifications**:
    -   Implement a Notification Center in the Header (Bell Icon).
    -   Fetch from `GET /api/notifications`.
    -   Mark as read on click.

## 3. Provider Dashboard (`/provider`)
**Current State**: Basic Services management and "Online/Offline" toggle.
**Target State**: Full business management.

### Actions:
- [ ] **Advanced Availability**:
    -   Add a Calendar View to the "Availability" tab.
    -   Show blocked/booked slots.
    -   (Future) Allow manual blocking of slots.
- [ ] **Booking Management**:
    -   Enhance "Bookings" tab to show "Respond" actions (Accept/Decline/Propose Alt) using `POST /api/bookings/[id]/respond`.
- [ ] **Earnings**:
    -   Ensure Earnings tab fetches from `/api/provider/earnings`.

## 4. Communication & Safety
**Current State**: Chat page exists (`/messages/[id]`). Reviews displayed on profile.
**Target State**: Full integration.

### Actions:
- [ ] **Post-Session Review**:
    -   Create a "Leave a Review" Modal/Page triggered after a session completes.
    -   Submit to `POST /api/sessions/[id]/review`.
- [ ] **Disputes**:
    -   Add "Report Issue" button on Booking/Session details.

---

## Execution Order
1.  **Refactor BookingWizard** (Blocker for correct data entry).
2.  **Client Bookings List** (Visibility of created bookings).
3.  **Provider Booking Management** (Completing the loop).
4.  **Notifications & Reviews** (Polish).
