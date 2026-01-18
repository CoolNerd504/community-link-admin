# Bookings & Sessions Page - Complete Implementation Guide

## Overview

The Bookings & Sessions Page is a comprehensive booking management interface that allows users to view, manage, and create bookings with service providers. Built following the ProSupport marketplace design language and structured around the `/api/bookings` endpoint payload specification, it provides three distinct views: Scheduled Sessions, Instant Requests, and History.

## Design Principles

- **API-Driven Design**: Built directly from the BookingResponse interface
- **Status-Based Organization**: Clear visual differentiation between booking states
- **Real-Time Context**: Countdown timers and live session indicators
- **Action-Oriented**: Prominent CTAs based on booking status
- **Consistent Design Language**: Matches marketplace, profile, and dashboard styling
- **Responsive Layout**: 3-column desktop, stacked mobile

---

## API Payload Structure

### Create Booking Request

```typescript
interface CreateBookingRequest {
  serviceId: string;       // Required: ID of the service to book
  
  // Scheduling
  date?: string;           // Required for scheduled (ISO Date string)
  startAt?: string;        // Alias for date
  duration?: number;       // Optional: Duration in minutes (defaults to service duration)
  
  // Instant Booking
  isInstant?: boolean;     // Optional: Set true for immediate connect requests
  
  // Details
  notes?: string;          // Optional: Message to provider
}
```

### Booking Response

```typescript
interface BookingResponse {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  
  // Timing & Cost
  requestedTime: string | null;  // ISO Date string
  duration: number;              // Minutes
  price: number;                 // Fixed price for this booking
  
  // Instant Booking Specifics
  isInstant: boolean;
  expiresAt: string | null;      // When the instant request expires
  
  // Metadata
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relationships
  clientId: string;
  serviceId: string;
  
  // Included Data
  service: {
    id: string;
    title: string;
    category: string;
    price: number;       // Base price
    duration: number;    // Base duration
    provider: {
      id: string;
      name: string;
      image: string | null;
      role: "PROVIDER" | "USER" | "ADMIN";
      kycStatus: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";
      profile?: {
        headline?: string;
        isVerified?: boolean;
        bio?: string;
      }
    };
  };
  
  client: {
    id: string;
    name: string;
    image: string | null;
  };
}
```

### Booking Status Flow

```
PENDING → ACCEPTED (Provider accepts)
PENDING → DECLINED (Provider rejects)
PENDING → EXPIRED (Time passed or instant timer expired)
```

---

## Layout Structure

### Grid System

```
Desktop (lg+):
┌──────────────────────────────────────────────┐
│  Header (Sticky)                              │
│  [Title + Stats]                              │
├──────────────────────────────────────────────┤
│  [Bookings List]  │  [Quick Actions Sidebar] │
│   (2 columns)     │      (1 column)          │
│   - Tabs          │  - Need Help Now Card    │
│   - Sessions      │  - Quick Actions         │
└──────────────────────────────────────────────┘

Mobile:
┌─────────────────┐
│ Header          │
├─────────────────┤
│ Stats (1 col)   │
├─────────────────┤
│ Tabs            │
├─────────────────┤
│ Bookings        │
├─────────────────┤
│ Quick Actions   │
└─────────────────┘
```

### Container
- Max width: 1400px
- Padding: 32px
- Background: #f5f5f5

---

## Component Structure

### File Location
```
/src/app/components/bookings-page.tsx
```

### TypeScript Interfaces

All interfaces match the API payload specification exactly.

### Additional Interfaces

```typescript
interface BookingStats {
  totalHours: number;
  activeBookings: number;
  walletCredits: number;
}

interface BookingsPageProps {
  onCreateBooking?: (booking: CreateBookingRequest) => void;
  onCancelBooking?: (bookingId: string) => void;
}
```

---

## Section 1: Header (Sticky)

**Position**: Sticky at top (z-index: 10)
**Background**: White with bottom border
**Padding**: 32px horizontal, 24px vertical

### 1.1 Title Area

```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-[28px] font-bold text-[#181818] mb-1">
      Bookings & Sessions
    </h1>
    <p className="text-[15px] text-[#767676]">
      Manage your appointments and session history
    </p>
  </div>
  
  {/* Search + New Booking Button */}
  <div className="flex items-center gap-3">
    {/* Search Input */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#767676]" />
      <input
        type="text"
        placeholder="Search bookings..."
        className="w-[280px] h-[44px] pl-10 pr-4 rounded-[12px] border border-[#eee] bg-[#f5f5f5] text-[14px] focus:outline-none focus:border-[#2563eb]"
      />
    </div>
    
    {/* New Booking Button */}
    <button className="flex items-center gap-2 px-4 h-[44px] bg-[#2563eb] text-white rounded-[12px] font-semibold text-[14px] hover:bg-[#1d4ed8]">
      <Plus className="size-4" />
      New Booking
    </button>
  </div>
</div>
```

**Search Input**:
- Width: 280px
- Height: 44px
- Icon: Search (left, 12px from edge)
- Placeholder: "Search bookings..."

**New Booking Button**:
- Background: #2563eb
- Hover: #1d4ed8
- Icon: Plus (16px)
- Height: 44px

### 1.2 Stats Grid

**Layout**: 3-column grid
**Gap**: 24px

```tsx
<div className="grid grid-cols-3 gap-6">
  {/* Total Hours */}
  <div className="bg-[#f5f5f5] rounded-[16px] p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[13px] text-[#767676] mb-1">TOTAL HOURS</p>
        <p className="text-[28px] font-bold text-[#181818]">128.5</p>
      </div>
      <div className="size-12 bg-[#e3f2fd] rounded-[12px] flex items-center justify-center">
        <Clock className="size-6 text-[#2563eb]" />
      </div>
    </div>
  </div>
  
  {/* Active Bookings */}
  <div className="bg-[#f5f5f5] rounded-[16px] p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[13px] text-[#767676] mb-1">ACTIVE BOOKINGS</p>
        <p className="text-[28px] font-bold text-[#181818]">4</p>
      </div>
      <div className="size-12 bg-[#f3e8ff] rounded-[12px] flex items-center justify-center">
        <Calendar className="size-6 text-[#9333ea]" />
      </div>
    </div>
  </div>
  
  {/* Wallet Credits */}
  <div className="bg-[#f5f5f5] rounded-[16px] p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[13px] text-[#767676] mb-1">WALLET CREDITS</p>
        <p className="text-[28px] font-bold text-[#181818]">$1,240</p>
      </div>
      <div className="size-12 bg-[#dcfce7] rounded-[12px] flex items-center justify-center">
        <DollarSign className="size-6 text-[#16a34a]" />
      </div>
    </div>
  </div>
</div>
```

**Stat Card Structure**:
- Background: #f5f5f5
- Border radius: 16px
- Padding: 16px
- Label: 13px uppercase, #767676
- Value: 28px bold, #181818
- Icon container: 48px, colored background

**Icon Container Colors**:
- Total Hours: Blue (#e3f2fd bg, #2563eb icon)
- Active Bookings: Purple (#f3e8ff bg, #9333ea icon)
- Wallet Credits: Green (#dcfce7 bg, #16a34a icon)

---

## Section 2: Tab Navigation

**Container**: Backdrop blur card
**Padding**: 8px
**Gap**: 8px between tabs

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-2 mb-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex gap-2">
    <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-[14px] font-semibold transition-all ${
      activeTab === "scheduled"
        ? "bg-[#2563eb] text-white shadow-md"
        : "text-[#767676] hover:bg-[#f5f5f5] hover:text-[#181818]"
    }`}>
      <Calendar className="size-4" />
      Scheduled
    </button>
    
    <button className={/* Same structure */}>
      <Zap className="size-4" />
      Instant Requests
    </button>
    
    <button className={/* Same structure */}>
      <History className="size-4" />
      History
    </button>
  </div>
</div>
```

**Three Tabs**:
1. Scheduled (Calendar icon)
2. Instant Requests (Zap icon)
3. History (History icon)

**Active State**:
- Background: #2563eb
- Text: White
- Shadow: Medium

**Inactive State**:
- Background: Transparent
- Text: #767676
- Hover: #f5f5f5 background, #181818 text

---

## Section 3: Scheduled Sessions Tab

### 3.1 Section Header

```tsx
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-2">
    <Calendar className="size-5 text-[#2563eb]" />
    <h2 className="text-[20px] font-bold text-[#181818]">Scheduled Sessions</h2>
  </div>
  <button className="text-[14px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1">
    Sync to Calendar
    <ExternalLink className="size-4" />
  </button>
</div>
```

### 3.2 Session Card Structure

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)]">
  <div className="flex items-start gap-4">
    {/* Provider Image */}
    <div className="relative">
      <img
        src={booking.service.provider.image}
        className="size-16 rounded-[16px] object-cover"
      />
      {booking.service.provider.profile?.isVerified && (
        <div className="absolute -top-1 -right-1">
          <VerificationIcon />
        </div>
      )}
    </div>
    
    {/* Booking Info */}
    <div className="flex-1">
      {/* Title & Provider */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[18px] font-semibold text-[#181818] mb-1">
            {booking.service.title}
          </h3>
          <p className="text-[14px] text-[#767676]">
            {booking.service.provider.name} • {booking.service.provider.profile?.headline}
          </p>
        </div>
        
        {/* Status Badge */}
        {booking.status === "ACCEPTED" && booking.requestedTime && (
          <span className="px-3 py-1 bg-[#fee2e2] text-[#ef4444] rounded-full text-[13px] font-bold">
            LIVE {getTimeUntil(booking.requestedTime)}
          </span>
        )}
        {booking.status === "PENDING" && (
          <span className="px-3 py-1 bg-[#dbeafe] text-[#2563eb] rounded-full text-[13px] font-semibold">
            SCHEDULED
          </span>
        )}
      </div>
      
      {/* Time & Duration Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-[14px] text-[#181818]">
          <Calendar className="size-4 text-[#767676]" />
          <span className="font-semibold">
            {formatDate(booking.requestedTime)}, {formatTime(booking.requestedTime)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#767676]">
          <Clock className="size-4" />
          <span>{booking.duration} MINS</span>
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#767676]">
          <Globe className="size-4" />
          <span>GOOGLE MEET</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Join Session (when live) */}
        <button className="flex-1 bg-[#2563eb] text-white rounded-[12px] py-3 px-4 font-semibold text-[15px] hover:bg-[#1d4ed8] flex items-center justify-center gap-2">
          <Video className="size-5" />
          Join Session
        </button>
        
        {/* OR Reschedule/Link Pending (when not live) */}
        <button className="flex-1 bg-[#f5f5f5] text-[#181818] rounded-[12px] py-3 px-4 font-semibold text-[14px] hover:bg-[#efefef]">
          Reschedule
        </button>
        {booking.status === "PENDING" && (
          <button className="px-6 py-3 bg-white border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[14px] hover:bg-[#f5f5f5]">
            Link Pending
          </button>
        )}
      </div>
    </div>
  </div>
</div>
```

**Provider Image**:
- Size: 64x64px
- Border radius: 16px
- Verification badge: Absolute positioned top-right (-4px, -4px)

**Status Badge Colors**:
- ACCEPTED (Live): Red background (#fee2e2), red text (#ef4444)
- PENDING (Scheduled): Blue background (#dbeafe), blue text (#2563eb)

**Time/Duration Display**:
- Calendar icon + Date/Time (bold black)
- Clock icon + Duration (gray)
- Globe icon + Platform (gray)
- Icon size: 16px
- Text size: 14px
- Gap: 16px between items

**Action Buttons**:
- Join Session: Full width, blue (#2563eb), Video icon
- Reschedule: Full width, gray (#f5f5f5)
- Link Pending: Auto width, white with border

### 3.3 Helper Functions

```typescript
// Format relative time
const getTimeUntil = (dateString: string) => {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `in ${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `in ${hours}h ${minutes}m`;
  }
  return `in ${minutes}m`;
};

// Format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
};
```

---

## Section 4: Instant Requests Tab

### 4.1 Section Header

```tsx
<div className="flex items-center gap-2 mb-4">
  <Zap className="size-5 text-[#f59e0b]" />
  <h2 className="text-[20px] font-bold text-[#181818]">Instant Requests</h2>
</div>
```

### 4.2 Request Card Structure

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-start gap-4">
    {/* Searching Animation */}
    <div className="size-16 bg-[#f0f4ff] rounded-[16px] flex items-center justify-center">
      <div className="size-8 bg-[#2563eb] rounded-full flex items-center justify-center animate-pulse">
        <div className="size-3 bg-white rounded-full"></div>
      </div>
    </div>
    
    {/* Request Info */}
    <div className="flex-1">
      {/* Title & Category */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[18px] font-semibold text-[#181818] mb-1">
            {booking.service.title}
          </h3>
          <p className="text-[14px] text-[#767676]">
            Category: {booking.service.category}
          </p>
        </div>
        
        {/* Cancel Button */}
        <button className="text-[14px] font-semibold text-[#ef4444] hover:text-[#dc2626]">
          Cancel Request
        </button>
      </div>
      
      {/* Status & Wait Time */}
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-[#dcfce7] text-[#16a34a] rounded-full text-[13px] font-semibold">
          WAITING FOR PROVIDER
        </span>
        {booking.expiresAt && (
          <div className="flex items-center gap-2 text-[13px] text-[#767676]">
            <Clock className="size-4" />
            <span>EST. WAIT: 2-5 MINS</span>
          </div>
        )}
      </div>
      
      {/* Notes Display */}
      {booking.notes && (
        <div className="bg-[#f5f5f5] rounded-[12px] p-3 mb-3">
          <p className="text-[13px] text-[#767676]">
            <span className="font-semibold text-[#181818]">Your message:</span> {booking.notes}
          </p>
        </div>
      )}
    </div>
  </div>
</div>
```

**Searching Animation**:
- Container: 64x64px, #f0f4ff background, rounded-[16px]
- Outer circle: 32px, #2563eb, rounded-full, `animate-pulse`
- Inner circle: 12px, white, rounded-full
- Creates pulsing radar/sonar effect

**Status Badge**:
- Background: #dcfce7 (light green)
- Text: #16a34a (green)
- Text: "WAITING FOR PROVIDER"

**Wait Time Display**:
- Clock icon + "EST. WAIT: 2-5 MINS"
- Text: 13px, #767676

**Notes Section**:
- Background: #f5f5f5
- Border radius: 12px
- Padding: 12px
- Label bold, message regular

### 4.3 Empty State

```tsx
{instantRequests.length === 0 && (
  <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-12 text-center">
    <Zap className="size-12 text-[#767676] mx-auto mb-4" />
    <p className="text-[15px] text-[#767676]">No active instant requests</p>
  </div>
)}
```

---

## Section 5: History Tab

### 5.1 Section Header

```tsx
<div className="flex items-center gap-2 mb-4">
  <History className="size-5 text-[#767676]" />
  <h2 className="text-[20px] font-bold text-[#181818]">Session History</h2>
</div>
```

### 5.2 History Card Structure

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)]">
  <div className="flex items-start gap-4">
    {/* Provider Image (no verification badge) */}
    <img
      src={booking.service.provider.image}
      className="size-16 rounded-[16px] object-cover"
    />
    
    {/* Booking Info */}
    <div className="flex-1">
      {/* Title & Date */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[18px] font-semibold text-[#181818] mb-1">
            {booking.service.title}
          </h3>
          <p className="text-[14px] text-[#767676]">
            {booking.service.provider.name} • {formatDate(booking.requestedTime)}
          </p>
        </div>
        
        {/* Status Badge */}
        <span className={`px-3 py-1 rounded-full text-[13px] font-semibold ${
          booking.status === "ACCEPTED" ? "bg-[#dcfce7] text-[#16a34a]" :
          booking.status === "DECLINED" ? "bg-[#fee2e2] text-[#ef4444]" :
          "bg-[#fef3c7] text-[#f59e0b]"
        }`}>
          {booking.status === "ACCEPTED" ? "COMPLETED" : booking.status}
        </span>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        {booking.status === "ACCEPTED" && (
          <>
            <button className="px-4 py-2 bg-[#f5f5f5] text-[#181818] rounded-[12px] font-semibold text-[13px] hover:bg-[#efefef] flex items-center gap-2">
              <FileText className="size-4" />
              Receipt
            </button>
            <button className="px-4 py-2 bg-[#f5f5f5] text-[#181818] rounded-[12px] font-semibold text-[13px] hover:bg-[#efefef] flex items-center gap-2">
              <Star className="size-4" />
              Rate Provider
            </button>
          </>
        )}
        {booking.status === "DECLINED" && (
          <button className="px-4 py-2 bg-[#f5f5f5] text-[#767676] rounded-[12px] font-semibold text-[13px] hover:bg-[#efefef]">
            View Details
          </button>
        )}
      </div>
    </div>
  </div>
</div>
```

**Status Badge Colors**:
- COMPLETED (ACCEPTED): Green (#dcfce7 bg, #16a34a text)
- DECLINED: Red (#fee2e2 bg, #ef4444 text)
- EXPIRED: Orange (#fef3c7 bg, #f59e0b text)

**Action Buttons (for completed)**:
- Receipt: FileText icon
- Rate Provider: Star icon
- Both use #f5f5f5 background

**Action Buttons (for declined)**:
- View Details: Gray text (#767676)

---

## Section 6: Right Sidebar

### 6.1 Need Help Now Card

**Position**: Sticky (top: 200px)
**Background**: Gradient from #181818 to #2c2c2c

```tsx
<div className="bg-gradient-to-br from-[#181818] to-[#2c2c2c] rounded-[24px] p-6 mb-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.2)] sticky top-[200px]">
  <div className="flex items-center gap-2 mb-4">
    <Zap className="size-5 text-[#f59e0b]" />
    <h3 className="text-[18px] font-semibold text-white">Need Help Now?</h3>
  </div>
  <p className="text-[14px] text-white/80 mb-6 leading-relaxed">
    Connect with available experts in under 5 minutes for urgent roadblocks.
  </p>
  <button className="w-full bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8]">
    Start Instant Request
  </button>
</div>
```

**Styling**:
- Gradient: from-[#181818] to-[#2c2c2c]
- Border radius: 24px
- Padding: 24px
- Shadow: Darker with 0.2 opacity
- Zap icon: Orange (#f59e0b)
- Title: 18px white
- Description: 14px white/80
- Button: Blue (#2563eb)

### 6.2 Quick Actions Card

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] mb-6">
  <h3 className="text-[16px] font-semibold text-[#181818] mb-4">Quick Actions</h3>
  
  <div className="space-y-2">
    {/* View Calendar */}
    <button className="w-full flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#f5f5f5] transition-colors text-left">
      <div className="size-10 bg-[#f0f4ff] rounded-[12px] flex items-center justify-center">
        <Calendar className="size-5 text-[#2563eb]" />
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-[#181818]">View Calendar</p>
        <p className="text-[12px] text-[#767676]">See all sessions</p>
      </div>
      <ChevronRight className="size-5 text-[#767676]" />
    </button>
    
    {/* Messages */}
    <button className="w-full flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#f5f5f5] transition-colors text-left">
      <div className="size-10 bg-[#f3e8ff] rounded-[12px] flex items-center justify-center">
        <MessageCircle className="size-5 text-[#9333ea]" />
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-[#181818]">Messages</p>
        <p className="text-[12px] text-[#767676]">Chat with providers</p>
      </div>
      <ChevronRight className="size-5 text-[#767676]" />
    </button>
    
    {/* Learning Path */}
    <button className="w-full flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#f5f5f5] transition-colors text-left">
      <div className="size-10 bg-[#dcfce7] rounded-[12px] flex items-center justify-center">
        <TrendingUp className="size-5 text-[#16a34a]" />
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-[#181818]">Learning Path</p>
        <p className="text-[12px] text-[#767676]">Track your progress</p>
      </div>
      <ChevronRight className="size-5 text-[#767676]" />
    </button>
  </div>
</div>
```

**Action Button Structure**:
- Full width, text-left
- Hover: #f5f5f5 background
- Icon container: 40px, colored background
- Title: 14px bold
- Description: 12px gray
- Chevron: Right arrow, 20px

**Icon Container Colors**:
- View Calendar: Blue (#f0f4ff bg, #2563eb icon)
- Messages: Purple (#f3e8ff bg, #9333ea icon)
- Learning Path: Green (#dcfce7 bg, #16a34a icon)

---

## Icons Used (lucide-react)

```javascript
import {
  Calendar,       // Calendar, dates, scheduled
  Clock,          // Time, duration, wait time
  Video,          // Video calls
  Zap,            // Instant requests, urgent
  History,        // History tab
  Search,         // Search input
  Plus,           // New booking
  X,              // Close/cancel
  DollarSign,     // Wallet credits
  TrendingUp,     // Learning path, growth
  CheckCircle,    // Completed status
  XCircle,        // Declined status
  AlertCircle,    // Warning/pending
  FileText,       // Receipt
  Star,           // Rate provider
  MessageCircle,  // Messages
  ExternalLink,   // External links
  ChevronRight,   // Navigation arrows
  MapPin,         // Location (future)
  Globe           // Platform (Google Meet)
} from "lucide-react";
```

---

## Color System

### Status Colors

```css
/* Booking Status */
--status-pending: #dbeafe;      /* Blue light */
--status-pending-text: #2563eb; /* Blue */

--status-accepted: #dcfce7;     /* Green light */
--status-accepted-text: #16a34a; /* Green */

--status-declined: #fee2e2;     /* Red light */
--status-declined-text: #ef4444; /* Red */

--status-expired: #fef3c7;      /* Yellow light */
--status-expired-text: #f59e0b;  /* Yellow */

/* Live/Active Indicator */
--live-bg: #fee2e2;             /* Red light */
--live-text: #ef4444;           /* Red */

/* Waiting/Processing */
--waiting-bg: #dcfce7;          /* Green light */
--waiting-text: #16a34a;        /* Green */
```

### Component Colors

```css
/* Stats Card Icons */
--stats-hours-bg: #e3f2fd;      /* Blue light */
--stats-hours-icon: #2563eb;    /* Blue */

--stats-bookings-bg: #f3e8ff;   /* Purple light */
--stats-bookings-icon: #9333ea; /* Purple */

--stats-wallet-bg: #dcfce7;     /* Green light */
--stats-wallet-icon: #16a34a;   /* Green */

/* Quick Actions Icons */
--action-calendar-bg: #f0f4ff;
--action-calendar-icon: #2563eb;

--action-message-bg: #f3e8ff;
--action-message-icon: #9333ea;

--action-learning-bg: #dcfce7;
--action-learning-icon: #16a34a;
```

---

## Responsive Breakpoints

```css
/* Mobile (< 640px) */
- Stats: 1 column
- Tabs: Icon only
- Session cards: Stack vertically
- Sidebar: Below main content

/* Tablet (640px - 1024px) */
- Stats: 2-3 columns
- Tabs: Icon + label
- Session cards: Full width
- Sidebar: Full width below

/* Desktop (> 1024px) */
- Stats: 3 columns
- Tabs: Full labels
- Grid: 2 columns (bookings) + 1 column (sidebar)
- Sidebar: Sticky
```

---

## State Management

### React State

```typescript
const [activeTab, setActiveTab] = useState<"scheduled" | "instant" | "history">("scheduled");
const [showBookingModal, setShowBookingModal] = useState(false);
```

### Props

```typescript
interface BookingsPageProps {
  onCreateBooking?: (booking: CreateBookingRequest) => void;
  onCancelBooking?: (bookingId: string) => void;
}
```

---

## API Integration

### Endpoints

```typescript
// Get all bookings
GET /api/bookings
Response: BookingResponse[]

// Create booking
POST /api/bookings
Body: CreateBookingRequest
Response: { message: string, booking: BookingResponse }

// Cancel booking
DELETE /api/bookings/:id
Response: { success: boolean }

// Get stats
GET /api/bookings/stats
Response: BookingStats
```

### Implementation Example

```typescript
// Fetch bookings
const fetchBookings = async () => {
  const response = await fetch('/api/bookings');
  const bookings: BookingResponse[] = await response.json();
  
  // Filter by status
  const scheduled = bookings.filter(b => 
    !b.isInstant && 
    (b.status === "PENDING" || b.status === "ACCEPTED")
  );
  
  const instant = bookings.filter(b => 
    b.isInstant && 
    b.status === "PENDING"
  );
  
  const history = bookings.filter(b => 
    b.status === "DECLINED" || 
    b.status === "EXPIRED" ||
    (b.status === "ACCEPTED" && isPast(b.requestedTime))
  );
  
  return { scheduled, instant, history };
};

// Create booking
const createBooking = async (data: CreateBookingRequest) => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Cancel booking
const cancelBooking = async (bookingId: string) => {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: 'DELETE'
  });
  return response.json();
};
```

---

## Accessibility

### ARIA Labels

```tsx
<button aria-label="Search bookings">
  <Search />
</button>

<button aria-label="Create new booking">
  <Plus /> New Booking
</button>

<button aria-label={`Join session with ${provider.name}`}>
  <Video /> Join Session
</button>
```

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys for tab navigation (optional enhancement)
- Escape to close modals

### Screen Reader Support

```tsx
<div role="tablist">
  <button role="tab" aria-selected={activeTab === "scheduled"}>
    Scheduled
  </button>
</div>

<div role="tabpanel" aria-labelledby="scheduled-tab">
  {/* Scheduled content */}
</div>
```

---

## Interactive States

### Hover States

```css
/* Session Cards */
.session-card:hover {
  box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.08);
}

/* Buttons */
.button-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

/* Quick Actions */
.quick-action:hover {
  background: #f5f5f5;
}
```

### Active States

```css
/* Tab Active */
.tab-active {
  background: #2563eb;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Button Active */
.button:active {
  transform: scale(0.98);
}
```

### Loading States

```tsx
{/* Searching Animation */}
<div className="animate-pulse">
  <div className="size-8 bg-[#2563eb] rounded-full">
    <div className="size-3 bg-white rounded-full"></div>
  </div>
</div>
```

---

## Testing Checklist

### Visual Testing
- [ ] Stats display correctly
- [ ] Tabs switch properly
- [ ] Session cards render with all info
- [ ] Status badges show correct colors
- [ ] Verification badges appear on verified providers
- [ ] Countdown timers work
- [ ] Empty states display
- [ ] Sidebar is sticky

### Functional Testing
- [ ] Tab switching works
- [ ] Search input functional
- [ ] New booking button triggers modal
- [ ] Join session button works
- [ ] Reschedule button functional
- [ ] Cancel request works
- [ ] Quick actions clickable

### Responsive Testing
- [ ] Mobile: Single column
- [ ] Tablet: Stats 2-3 columns
- [ ] Desktop: Full 3-column layout
- [ ] Sidebar stacks on mobile
- [ ] Cards full width on mobile

### State Testing
- [ ] Active tab highlighted
- [ ] Bookings filtered correctly
- [ ] Status badges match booking status
- [ ] Time formatting correct
- [ ] Empty states show when no data

### API Integration Testing
- [ ] GET /api/bookings returns data
- [ ] POST /api/bookings creates booking
- [ ] DELETE /api/bookings/:id cancels
- [ ] Error handling works
- [ ] Loading states display

---

## Performance Optimizations

### Implemented
- Sticky positioning (CSS-only)
- Conditional rendering of tabs
- Optimized SVG icons (lucide-react)
- Transition using transform/opacity

### Recommended

```typescript
// Memoize expensive calculations
const scheduledBookings = useMemo(() => 
  bookings.filter(b => !b.isInstant && b.status !== "DECLINED"),
  [bookings]
);

// Debounce search
const debouncedSearch = useDebounce(searchQuery, 300);

// Virtual scrolling for long lists
import { FixedSizeList } from 'react-window';

// Lazy load tabs
const ScheduledTab = lazy(() => import('./tabs/scheduled'));
const InstantTab = lazy(() => import('./tabs/instant'));
const HistoryTab = lazy(() => import('./tabs/history'));
```

---

## Common Customizations

### Change Status Colors

```typescript
// Update status badge colors
const getStatusColor = (status: BookingResponse['status']) => {
  const colors = {
    PENDING: { bg: '#your-color-light', text: '#your-color' },
    ACCEPTED: { bg: '#your-color-light', text: '#your-color' },
    DECLINED: { bg: '#your-color-light', text: '#your-color' },
    EXPIRED: { bg: '#your-color-light', text: '#your-color' }
  };
  return colors[status];
};
```

### Add New Stat Card

```tsx
<div className="bg-[#f5f5f5] rounded-[16px] p-4">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-[13px] text-[#767676] mb-1">YOUR STAT</p>
      <p className="text-[28px] font-bold text-[#181818]">{value}</p>
    </div>
    <div className="size-12 bg-[#your-color-light] rounded-[12px] flex items-center justify-center">
      <YourIcon className="size-6 text-[#your-color]" />
    </div>
  </div>
</div>
```

### Customize Time Format

```typescript
// Change date format
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
};

// Change time format (24-hour)
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};
```

### Add Filter Options

```tsx
<div className="flex items-center gap-2 mb-4">
  <select className="px-4 py-2 rounded-[12px] border border-[#eee] bg-white text-[14px]">
    <option>All Categories</option>
    <option>UX Design</option>
    <option>Development</option>
    <option>Branding</option>
  </select>
  
  <select className="px-4 py-2 rounded-[12px] border border-[#eee] bg-white text-[14px]">
    <option>All Statuses</option>
    <option>Pending</option>
    <option>Accepted</option>
    <option>Declined</option>
  </select>
</div>
```

---

## Future Enhancements

### Planned Features

1. **Calendar Integration**
   - Full calendar view
   - Sync with Google/Outlook
   - Drag-and-drop rescheduling

2. **Booking Modal**
   - Service selection
   - Date/time picker
   - Duration selector
   - Notes/message input
   - Instant vs scheduled toggle

3. **Real-Time Updates**
   - WebSocket for instant request matching
   - Live countdown timers
   - Push notifications for booking updates

4. **Advanced Filters**
   - Filter by date range
   - Filter by category
   - Filter by provider
   - Filter by status
   - Filter by price range

5. **Bulk Actions**
   - Select multiple bookings
   - Cancel multiple
   - Export to calendar
   - Download invoices

6. **Analytics**
   - Spending trends
   - Category breakdown
   - Provider distribution
   - Session completion rate

7. **Recurring Bookings**
   - Weekly/monthly sessions
   - Auto-renewal
   - Subscription management

8. **Session Reminders**
   - Email reminders
   - SMS reminders
   - Push notifications
   - Custom reminder timing

9. **Video Call Integration**
   - Built-in video calls
   - Screen sharing
   - Recording
   - Transcript generation

10. **Payment Management**
    - View transaction history
    - Download receipts
    - Refund requests
    - Dispute resolution

---

## Component Usage

### Import

```typescript
import { BookingsPage } from "@/app/components/bookings-page";
```

### Basic Usage

```tsx
<BookingsPage
  onCreateBooking={(booking) => handleCreateBooking(booking)}
  onCancelBooking={(id) => handleCancelBooking(id)}
/>
```

### With State Management

```tsx
function App() {
  const handleCreateBooking = async (booking: CreateBookingRequest) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      const data = await response.json();
      // Refresh bookings list
      fetchBookings();
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
        // Refresh bookings list
        fetchBookings();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  return (
    <BookingsPage
      onCreateBooking={handleCreateBooking}
      onCancelBooking={handleCancelBooking}
    />
  );
}
```

---

## Dependencies

```json
{
  "lucide-react": "^0.x.x",
  "react": "^18.x.x",
  "react-dom": "^18.x.x"
}
```

### SVG Assets
```typescript
import svgPaths from "@/imports/svg-kgp0lgcn47";
// Used for verification badge
```

---

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile Safari: Full support
- Chrome Mobile: Full support

---

## Maintenance Notes

### Regular Updates Needed
- Bookings data refresh (real-time or polling)
- Stats recalculation
- Countdown timer updates
- Status badge updates

### Code Quality
- All TypeScript interfaces match API
- Proper error handling
- Loading states
- Empty states
- Consistent naming

---

## Design Consistency

This component follows the exact design language of:
- **Marketplace Page**: Card styles, grid layout
- **Provider Profile**: Verification badges, rating display
- **User Dashboard**: Stats cards, tab navigation
- **User Profile**: Color system, interactive states

All components share:
- #2563eb primary blue
- #181818 text color
- #f5f5f5 background
- Backdrop blur cards
- 12-24px border radius
- Consistent spacing (8px base)

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Component**: BookingsPage  
**Design System**: ProSupport Marketplace  
**API Endpoint**: `/api/bookings`
