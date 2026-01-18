# Provider Flow Specification

This document outlines the complete Provider experience, organized by bottom navigation tabs. Each section includes:
- Feature description
- Required API endpoints
- Pseudo-code flowcharts

---

## Tab 1: Home (Dashboard)

### Features
| Feature | Description |
|---------|-------------|
| Greeting | Display provider's name |
| Verification Banner | Show KYC status and prompt to complete |
| Online Status Toggle | Toggle visibility to clients |
| Instant Sessions Toggle | Toggle availability for instant bookings |
| Earnings Summary | Show total earnings, minutes, and rating |
| Active Services | List of provider's active services |
| Pending Requests | Show pending booking requests (when Instant Sessions is ON) |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/provider/earnings` | GET | Fetch earnings summary |
| `/api/provider/requests` | GET | Fetch pending booking requests |
| `/api/providers/:id` | GET | Fetch provider profile details |
| `/api/services` | GET | Fetch provider's services |
| `/api/profile` | PATCH | Update online/instant status |

### Pseudo-code Flow

```
SCREEN: ProviderHome

ON_MOUNT:
    PARALLEL_FETCH:
        earnings = GET /api/provider/earnings
        requests = GET /api/provider/requests
        details  = GET /api/providers/{userId}
        services = GET /api/services
    END

    SET earnings_display = earnings.totalEarningsZMW
    SET minutes_display  = earnings.totalMinutesServiced
    SET rating_display   = details.rating
    SET online_toggle    = user.isOnline
    SET instant_toggle   = user.isAvailableForInstant

ON_TOGGLE_ONLINE(value):
    SET online_toggle = value
    PATCH /api/profile { isOnline: value }
    IF error:
        REVERT online_toggle
        SHOW_ALERT("Failed to update status")

ON_TOGGLE_INSTANT(value):
    IF value AND NOT online_toggle:
        CONFIRM("You're offline. Turn on both?")
        IF confirmed:
            SET online_toggle = true
            SET instant_toggle = true
            PATCH /api/profile { isOnline: true, isAvailableForInstant: true }
        END
    ELSE:
        SET instant_toggle = value
        PATCH /api/profile { isAvailableForInstant: value }

ON_TAP_SERVICE(service):
    NAVIGATE_TO ManageServices

ON_TAP_REQUEST(request):
    NAVIGATE_TO SessionOverview(request)
```

---

## Tab 2: Schedule

### Features
| Feature | Description |
|---------|-------------|
| Tabs | "Upcoming" / "Past Sessions" |
| Booking Requests | List of pending booking requests with Accept/Decline |
| Upcoming Sessions | Confirmed sessions with Join button |
| Past Sessions | Completed/Cancelled sessions with View Details |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/bookings` | GET | Fetch all bookings |
| `/api/sessions?status=COMPLETED` | GET | Fetch past sessions |
| `/api/bookings/:id/respond` | POST | Accept or decline booking |

### Pseudo-code Flow

```
SCREEN: ProviderSchedule

STATE:
    activeTab = 'upcoming' | 'past'
    bookings = []
    sessions = []

ON_MOUNT / ON_TAB_CHANGE:
    IF activeTab == 'upcoming':
        bookings = GET /api/bookings
        pendingRequests  = FILTER bookings WHERE status == 'PENDING'
        upcomingSessions = FILTER bookings WHERE status IN ('ACCEPTED', 'CONFIRMED')
    ELSE:
        sessions = GET /api/sessions?status=COMPLETED

ON_ACCEPT(bookingId):
    POST /api/bookings/{bookingId}/respond { status: 'accepted' }
    REFRESH_DATA()

ON_DECLINE(bookingId):
    POST /api/bookings/{bookingId}/respond { status: 'declined' }
    REFRESH_DATA()

ON_TAP_SESSION(session):
    NAVIGATE_TO SessionOverview(session)

ON_JOIN(session):
    NAVIGATE_TO SessionCallScreen(session)
```

---

## Tab 3: Insights (Analytics)

### Features
| Feature | Description |
|---------|-------------|
| Date Range Selector | 7d / 30d / 90d |
| Earnings Chart | Visual earnings breakdown |
| Key Metrics | Completion rate, Retention, New clients |
| Weekly Sessions Graph | Bar chart of sessions per day |
| Rating Breakdown | Star distribution |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/provider/analytics?range=7d` | GET | Fetch analytics for selected range |

### Pseudo-code Flow

```
SCREEN: ProviderInsights

STATE:
    range = '7d' | '30d' | '90d'
    analytics = null

ON_MOUNT / ON_RANGE_CHANGE(newRange):
    SET range = newRange
    analytics = GET /api/provider/analytics?range={range}

    DISPLAY:
        completion_rate = analytics.completion.value
        retention_rate  = analytics.retention.value
        rating          = analytics.rating
        weekly_chart    = analytics.weeklySessions
        rating_bars     = analytics.ratingBreakdown
```

---

## Tab 4: Profile

### Features
| Feature | Description |
|---------|-------------|
| Basic Info | Name, headline, avatar |
| KYC Section | Complete/view KYC verification |
| Privacy & Security | PIN, password settings |
| Manage Services | Link to service management |
| Logout | End session |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/profile` | GET | Fetch user profile |
| `/api/profile` | PATCH | Update profile fields |
| `/api/kyc/status` | GET | Check KYC status |

### Pseudo-code Flow

```
SCREEN: Profile (Provider)

ON_MOUNT:
    profile = GET /api/profile
    kycStatus = GET /api/kyc/status

ON_UPDATE_PROFILE(fields):
    PATCH /api/profile { ...fields }
    REFRESH profile

ON_TAP_MANAGE_SERVICES:
    NAVIGATE_TO ManageServices

ON_TAP_PRIVACY:
    NAVIGATE_TO PrivacySecurity

ON_LOGOUT:
    CLEAR_TOKEN()
    NAVIGATE_TO Login
```

---

## Manage Services Screen (from Profile)

### Features
| Feature | Description |
|---------|-------------|
| Tabs | "Services" / "Interests" |
| Service List | CRUD for provider services |
| Service Form | Title, Description, Category (multi-select) |
| Interest Chips | Select/deselect interests from categories |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/services` | GET | List provider's services |
| `/api/services` | POST | Create new service |
| `/api/services/:id` | PUT | Update service |
| `/api/services/:id` | DELETE | Delete service |
| `/api/categories` | GET | Fetch available categories |
| `/api/profile` | PATCH | Save selected interests |

### Pseudo-code Flow

```
SCREEN: ManageServices

STATE:
    activeTab = 'services' | 'interests'
    services = []
    categories = []
    selectedInterests = []

ON_MOUNT:
    services = GET /api/services
    categories = GET /api/categories
    profile = GET /api/profile
    selectedInterests = profile.interests

--- SERVICES TAB ---

ON_ADD_SERVICE:
    OPEN ServiceModal (empty form)

ON_EDIT_SERVICE(service):
    OPEN ServiceModal (pre-filled with service data)

ON_SAVE_SERVICE(formData):
    IF editing:
        PUT /api/services/{service.id} { ...formData }
    ELSE:
        POST /api/services { ...formData }
    REFRESH services

ON_DELETE_SERVICE(serviceId):
    CONFIRM("Delete this service?")
    IF confirmed:
        DELETE /api/services/{serviceId}
        REFRESH services

--- INTERESTS TAB ---

ON_TOGGLE_INTEREST(interest):
    IF interest IN selectedInterests:
        REMOVE interest FROM selectedInterests
    ELSE:
        ADD interest TO selectedInterests

ON_SAVE_INTERESTS:
    PATCH /api/profile { interests: selectedInterests }
    SHOW_SUCCESS("Interests updated")
```

---

## Session Call Screen

### Features
| Feature | Description |
|---------|-------------|
| Video Feed | Local + Remote video |
| Controls | Mute, Camera, End Call |
| Timer | Session duration |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/sessions/:id/start` | POST | Mark session as started |
| `/api/sessions/:id/end` | POST | End session |

### Pseudo-code Flow

```
SCREEN: SessionCallScreen

ON_MOUNT(booking):
    POST /api/sessions/{booking.id}/start
    INIT_VIDEO_CALL()
    START_TIMER()

ON_END_CALL:
    POST /api/sessions/{booking.id}/end
    STOP_TIMER()
    NAVIGATE_TO SessionReview(booking)
```

---

## Session Review Screen

### Features
| Feature | Description |
|---------|-------------|
| Rating Input | Star rating |
| Comment Input | Text feedback |
| Submit Button | Send review |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/reviews` | POST | Submit review |

### Pseudo-code Flow

```
SCREEN: SessionReviewModal

STATE:
    rating = 0
    comment = ''

ON_SUBMIT:
    POST /api/reviews {
        bookingId: booking.id,
        rating: rating,
        comment: comment
    }
    NAVIGATE_TO Home
```

---

## Summary: All Provider Endpoints

| Category | Endpoint | Method | Used In |
|----------|----------|--------|---------|
| Dashboard | `/api/provider/earnings` | GET | ProviderHome |
| Dashboard | `/api/provider/requests` | GET | ProviderHome |
| Dashboard | `/api/providers/:id` | GET | ProviderHome |
| Profile | `/api/profile` | GET/PATCH | ProviderHome, Profile, ManageServices |
| Services | `/api/services` | CRUD | ManageServices, ProviderHome |
| Categories | `/api/categories` | GET | ManageServices |
| Bookings | `/api/bookings` | GET | ProviderSchedule |
| Bookings | `/api/bookings/:id/respond` | POST | ProviderSchedule |
| Sessions | `/api/sessions` | GET | ProviderSchedule |
| Sessions | `/api/sessions/:id/start` | POST | SessionCallScreen |
| Sessions | `/api/sessions/:id/end` | POST | SessionCallScreen |
| Reviews | `/api/reviews` | POST | SessionReviewModal |
| Analytics | `/api/provider/analytics` | GET | ProviderInsights |
| KYC | `/api/kyc/status` | GET | Profile |
