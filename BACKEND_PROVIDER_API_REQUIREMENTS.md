# Backend API Requirements for Provider Dashboard

This document specifies the API endpoints required by the CommLink Mobile App that are **not yet implemented** on the backend. These endpoints are needed to replace mock data in the Provider-facing screens.

---

## Priority Overview

| Priority | Endpoint | Purpose |
|:---------|:---------|:--------|
| **P0** | `GET /api/services` | Provider's own services list |
| **P0** | `GET /api/provider/analytics` | Insights dashboard data |
| **P1** | `GET /api/sessions` | Completed sessions history |
| **P1** | `PATCH /api/mobile/profile` (extend) | Save user interests |

---

## 1. Provider Services List

### `GET /api/services`

**Purpose:** Retrieve all services created by the authenticated provider.

**Authentication:** Bearer Token (JWT)

**Query Parameters:**
| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `providerId` | string | Optional | Filter by provider ID (if not using JWT) |

**Response (200 OK):**
```json
[
  {
    "id": "svc-123",
    "title": "Video Consultation",
    "description": "One-on-one video call session",
    "category": "Consulting",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "svc-456",
    "title": "Voice Strategy Call",
    "description": "All things Strategy",
    "category": "Coaching",
    "isActive": true,
    "createdAt": "2026-01-10T00:00:00Z"
  }
]
```

**Notes:**
- If using JWT, derive `providerId` from the token.
- Mobile will convert `price` to display format (e.g., `K80.00`).
- Mobile will convert `duration` to `"60 min"` string.
- Mobile will map `isActive: true` → `status: 'Active'`.

---

## 2. Provider Analytics

### `GET /api/provider/analytics`

**Purpose:** Comprehensive analytics data for the Insights screen.

**Authentication:** Bearer Token (JWT)

**Query Parameters:**
| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `range` | string | Optional | `7d`, `30d`, or `90d`. Default: `7d` |

**Response (200 OK):**
```json
{
  "completion": {
    "value": 98.4,
    "change": 2.1,
    "trend": "up"
  },
  "retention": {
    "value": 75,
    "change": -0.5,
    "trend": "down"
  },
  "rating": 4.9,
  "reviewCount": 128,
  "totalDuration": 1240,
  "durationChange": 12,
  "newClients": 24,
  "clientsChange": 5,
  "weeklySessions": [
    { "day": "MON", "count": 5 },
    { "day": "TUE", "count": 8 },
    { "day": "WED", "count": 6 },
    { "day": "THU", "count": 12 },
    { "day": "FRI", "count": 10 },
    { "day": "SAT", "count": 4 },
    { "day": "SUN", "count": 2 }
  ],
  "ratingBreakdown": [
    { "stars": 5, "percentage": 90 },
    { "stars": 4, "percentage": 7 },
    { "stars": 3, "percentage": 2 },
    { "stars": 2, "percentage": 1 },
    { "stars": 1, "percentage": 0 }
  ]
}
```

**Field Definitions:**
- `completion`: Session completion rate (sessions completed / sessions booked)
- `retention`: Percentage of clients who booked again
- `totalDuration`: Total minutes of all sessions in the period
- `durationChange`: Percentage change from previous period
- `weeklySessions`: Session counts aggregated by day of week
- `ratingBreakdown`: Distribution of review ratings

---

## 3. Sessions History

### `GET /api/sessions`

**Purpose:** Retrieve completed/cancelled sessions for the provider.

**Authentication:** Bearer Token (JWT)

**Query Parameters:**
| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `providerId` | string | Optional | Filter by provider (derive from JWT) |
| `status` | string | Optional | `COMPLETED`, `CANCELLED`, or `ALL` |
| `limit` | number | Optional | Max results. Default: 20 |
| `offset` | number | Optional | Pagination offset |

**Response (200 OK):**
```json
[
  {
    "id": "sess-789",
    "clientName": "Robert Fox",
    "clientImage": "https://...",
    "service": "Video Consultation",
    "date": "2026-01-16T14:00:00Z",
    "durationMinutes": 45,
    "status": "COMPLETED"
  },
  {
    "id": "sess-790",
    "clientName": "Esther Howard",
    "service": "Voice Strategy Call",
    "date": "2026-01-15T10:00:00Z",
    "durationMinutes": 30,
    "status": "COMPLETED"
  }
]
```

**Notes:**
- `durationMinutes` represents the time consumed (the currency).
- No `price` field; earnings are calculated from minutes serviced.

---

## 4. Extend Profile Update

### `PATCH /api/mobile/profile` (Extension)

**Purpose:** Allow saving user interests for content personalization.

**Current Payload:**
```json
{
  "bio": "...",
  "location": "...",
  "isOnline": true,
  "isAvailableForInstant": true
}
```

**Extended Payload (NEW):**
```json
{
  "bio": "...",
  "location": "...",
  "isOnline": true,
  "isAvailableForInstant": true,
  "interests": ["Mentorship", "Fitness", "Technology"]
}
```

**Database Change:**
- Add `interests` field to `Profile` model: `interests String[] @default([])`

**Response (200 OK):**
```json
{
  "user": {
    "id": "...",
    "name": "...",
    "profile": {
      "bio": "...",
      "interests": ["Mentorship", "Fitness", "Technology"]
    }
  },
  "message": "Profile updated successfully"
}
```

---

## 5. Extend Earnings Response

### `GET /api/provider/earnings` (Extension)

**Purpose:** Provider earnings summary based on **minutes serviced**.

**Current Response:**
```json
{
  "totalMinutesServiced": 1200,
  "pendingMinutes": 50,
  "currentMonthMinutes": 300
}
```

**Extended Response (NEW):**
```json
{
  "totalMinutesServiced": 1200,
  "pendingMinutes": 50,
  "currentMonthMinutes": 300,
  "minutesGrowthPercent": 12.5
}
```

**Notes:**
- All earnings are measured in **minutes**, not monetary value.
- `pendingMinutes`: Minutes from sessions not yet marked complete.
- `minutesGrowthPercent`: Percentage change from previous period.

---

## Implementation Checklist (Backend)

- [ ] Implement `GET /api/services` with provider filtering
- [ ] Implement `GET /api/provider/analytics` with date range support
- [ ] Implement `GET /api/sessions` with status filtering
- [ ] Extend `PATCH /api/mobile/profile` to accept `interests[]`
- [ ] Extend `GET /api/provider/earnings` with month/growth data
- [ ] Add `interests` field to Profile database model
