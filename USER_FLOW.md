# User Flow Specification

This document outlines the complete User (Client) experience, organized by bottom navigation tabs. Each section includes:
- Feature description
- Required API endpoints
- Pseudo-code flowcharts

---

## Tab 1: Home (Dashboard)

### Features
| Feature | Description |
|---------|-------------|
| Greeting | Display user's name |
| Balance Card | Show available minutes and Top Up button |
| Stats | Sessions this month, Minutes used |
| Upcoming Sessions | Next confirmed/accepted bookings |
| Favorite Providers | Quick access to saved providers |
| Tips | Platform tips and suggestions |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/wallet/balance` | GET | Fetch wallet balance & minutes |
| `/api/bookings` | GET | Fetch user's bookings |
| `/api/mobile/favorites` | GET | Fetch favorite providers |
| `/api/providers/:id` | GET | Fetch provider details |

### Pseudo-code Flow

```
SCREEN: Home

ON_MOUNT:
    PARALLEL_FETCH:
        wallet   = GET /api/wallet/balance
        bookings = GET /api/bookings
        favorites = GET /api/mobile/favorites
    END

    SET available_minutes = wallet.availableMinutes
    SET sessions_this_month = COUNT(bookings WHERE status IN ('COMPLETED', 'ACCEPTED') AND month = currentMonth)
    SET minutes_used = SUM(bookings WHERE status == 'COMPLETED' -> duration)
    SET upcoming = FILTER(bookings WHERE date > now AND status IN ('ACCEPTED', 'PENDING')) SORT BY date

ON_PULL_REFRESH:
    RE-FETCH all data

ON_TAP_TOP_UP:
    NAVIGATE_TO Wallet

ON_TAP_UPCOMING_SESSION(booking):
    NAVIGATE_TO SessionOverview(booking)

ON_TAP_FAVORITE_PROVIDER(provider):
    fullProvider = GET /api/providers/{provider.id}
    NAVIGATE_TO ProviderProfile(fullProvider)

ON_TAP_FIND_MORE:
    NAVIGATE_TO Discover
```

---

## Tab 2: Discover

### Features
| Feature | Description |
|---------|-------------|
| Search Bar | Text search for providers |
| Category Pills | Filter by category |
| View Toggle | List / Grid view |
| Provider Cards | Display matching providers |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/categories` | GET | Fetch available categories |
| `/api/providers/search` | GET | Search providers with filters |

### Pseudo-code Flow

```
SCREEN: Discover

STATE:
    searchQuery = ''
    selectedCategory = null
    providers = []
    categories = []

ON_MOUNT:
    categories = GET /api/categories
    TRIGGER search

ON_SEARCH_CHANGE(query) OR ON_CATEGORY_CHANGE(category):
    DEBOUNCE 500ms:
        providers = GET /api/providers/search?q={query}&category={category}

ON_TAP_PROVIDER(provider):
    NAVIGATE_TO ProviderProfile(provider)

ON_TAP_FILTER:
    SHOW_FILTER_MODAL (minPrice, maxPrice, etc.)
```

---

## Tab 3: Schedule

### Features
| Feature | Description |
|---------|-------------|
| Tabs | "Upcoming" / "History" |
| Pending Requests | User's pending booking requests |
| Confirmed Sessions | Accepted bookings with Join button |
| Past Sessions | Completed/Cancelled with View Receipt |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/bookings` | GET | Fetch all user bookings |

### Pseudo-code Flow

```
SCREEN: UserSchedule

STATE:
    activeTab = 'upcoming' | 'past'
    bookings = []

ON_MOUNT:
    bookings = GET /api/bookings

    IF activeTab == 'upcoming':
        pendingRequests = FILTER bookings WHERE status == 'PENDING'
        confirmedSessions = FILTER bookings WHERE status IN ('ACCEPTED', 'CONFIRMED')
    ELSE:
        pastSessions = FILTER bookings WHERE status IN ('COMPLETED', 'CANCELLED')

ON_TAP_SESSION(session):
    NAVIGATE_TO SessionOverview(session)

ON_JOIN(session):
    NAVIGATE_TO SessionCallScreen(session)

ON_VIEW_RECEIPT(session):
    SHOW_RECEIPT_MODAL(session)
```

---

## Tab 4: Profile

### Features
| Feature | Description |
|---------|-------------|
| Basic Info | Name, email, avatar |
| KYC Section | Complete/view verification |
| Privacy & Security | PIN, password settings |
| Linked Accounts | Payment methods |
| Logout | End session |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/profile` | GET | Fetch user profile |
| `/api/profile` | PATCH | Update profile fields |
| `/api/kyc/status` | GET | Check KYC status |

### Pseudo-code Flow

```
SCREEN: Profile (User)

ON_MOUNT:
    profile = GET /api/profile
    kycStatus = GET /api/kyc/status

ON_UPDATE_PROFILE(fields):
    PATCH /api/profile { ...fields }
    REFRESH profile

ON_TAP_LINKED_ACCOUNTS:
    NAVIGATE_TO LinkedAccounts

ON_TAP_PRIVACY:
    NAVIGATE_TO PrivacySecurity

ON_LOGOUT:
    CLEAR_TOKEN()
    NAVIGATE_TO Login
```

---

## Provider Profile Screen (from Discover/Favorites)

### Features
| Feature | Description |
|---------|-------------|
| Header | Avatar, name, headline, verified badge |
| Tabs | "Bio" / "Interests" / "Posts" |
| Rating Stats | Overall rating, review count, breakdown |
| Services List | Provider's available services |
| Follow/Favorite | Social actions |
| Book Button | Open booking flow |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/providers/:id` | GET | Fetch provider details |
| `/api/providers/:id/follow` | POST | Toggle follow |
| `/api/providers/:id/favorite` | POST | Toggle favorite |
| `/api/providers/:id/availability` | GET | Fetch booking availability |
| `/api/bookings` | POST | Create booking |

### Pseudo-code Flow

```
SCREEN: ProviderProfile

ON_MOUNT(providerId):
    provider = GET /api/providers/{providerId}

    SET isFollowing = provider.isFollowing
    SET isFavorite = provider.isFavorite

ON_TOGGLE_FOLLOW:
    POST /api/providers/{providerId}/follow
    TOGGLE isFollowing

ON_TOGGLE_FAVORITE:
    POST /api/providers/{providerId}/favorite
    TOGGLE isFavorite

ON_BOOK_SESSION:
    OPEN BookingFlowModal(provider)
```

---

## Booking Flow Modal

### Features
| Feature | Description |
|---------|-------------|
| Step 1 | Select service + duration |
| Step 2 | Select date + time slot |
| Step 3 | Confirm + add notes |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/providers/:id/availability` | GET | Fetch available slots |
| `/api/bookings` | POST | Create booking request |

### Pseudo-code Flow

```
MODAL: BookingFlowModal

STATE:
    step = 1 | 2 | 3
    selectedService = null
    duration = 0
    selectedDate = null
    selectedTimeSlot = null
    notes = ''
    availability = []

--- STEP 1: Service Selection ---

ON_SELECT_SERVICE(service):
    SET selectedService = service
    SET duration = service.duration (default)

ON_SELECT_DURATION(mins):
    SET duration = mins

ON_NEXT (step 1 -> 2):
    VALIDATE: selectedService AND duration >= 15
    FETCH availability:
        data = GET /api/providers/{providerId}/availability?date={today}&days=7
        SET availability = data.availability
    SET step = 2

--- STEP 2: Date & Time ---

ON_SELECT_DATE(date):
    SET selectedDate = date
    SET selectedTimeSlot = null

ON_SELECT_TIME_SLOT(time):
    SET selectedTimeSlot = time

ON_NEXT (step 2 -> 3):
    VALIDATE: selectedDate AND selectedTimeSlot
    SET step = 3

--- STEP 3: Confirmation ---

ON_ADD_NOTES(text):
    SET notes = text

ON_CONFIRM:
    startAt = COMBINE(selectedDate, selectedTimeSlot) -> ISO String
    
    POST /api/bookings {
        serviceId: selectedService.id,
        startAt: startAt,
        duration: duration,
        notes: notes,
        isInstant: false
    }
    
    CLOSE modal
    SHOW success feedback
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

## Summary: All User Endpoints

| Category | Endpoint | Method | Used In |
|----------|----------|--------|---------|
| Dashboard | `/api/wallet/balance` | GET | Home |
| Dashboard | `/api/bookings` | GET | Home, UserSchedule |
| Dashboard | `/api/mobile/favorites` | GET | Home |
| Discovery | `/api/categories` | GET | Discover |
| Discovery | `/api/providers/search` | GET | Discover |
| Provider | `/api/providers/:id` | GET | ProviderProfile |
| Provider | `/api/providers/:id/follow` | POST | ProviderProfile |
| Provider | `/api/providers/:id/favorite` | POST | ProviderProfile |
| Booking | `/api/providers/:id/availability` | GET | BookingFlowModal |
| Booking | `/api/bookings` | POST | BookingFlowModal |
| Sessions | `/api/sessions/:id/start` | POST | SessionCallScreen |
| Sessions | `/api/sessions/:id/end` | POST | SessionCallScreen |
| Reviews | `/api/reviews` | POST | SessionReviewModal |
| Profile | `/api/profile` | GET/PATCH | Profile |
| KYC | `/api/kyc/status` | GET | Profile |
| Wallet | `/api/wallet/balance` | GET | Home, Wallet |
