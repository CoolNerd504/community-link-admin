# User Dashboard - Complete Implementation Guide

## Overview

The User Dashboard is a comprehensive interface that provides users with a centralized view of their session bookings, statistics, and progress tracking. It follows the established design language of the ProSupport marketplace with consistent styling, spacing, and component patterns.

## Design System

### Color Palette

```css
/* Primary Colors */
--primary-blue: #2563eb;
--primary-blue-dark: #1d4ed8;

/* Text Colors */
--text-primary: #181818;
--text-secondary: #767676;
--text-tertiary: #a2a2a2;

/* Background Colors */
--bg-primary: #f5f5f5;
--bg-card: rgba(252, 252, 252, 0.95);
--bg-white: #ffffff;

/* Border Colors */
--border-light: #eee;
--border-lighter: #efefef;

/* Status Colors */
--green: #16a34a;
--green-light: #dcfce7;
--green-bright: #22c55e;
--red: #ef4444;
--red-light: #fee2e2;
--purple: #9333ea;
--purple-light: #f3e8ff;
--blue-light: #e3f2fd;
--blue-lighter: #dbeafe;
--blue-lightest: #f0f4ff;
--yellow: #f59e0b;
--yellow-light: #fef3c7;
```

### Typography

```css
/* Headings */
h1: 28px, font-weight: 700 (bold)
h2: 24px, font-weight: 700 (bold)
h3: 18px, font-weight: 600 (semibold)

/* Body Text */
Large: 15px, font-weight: 600 (semibold)
Regular: 14px, font-weight: 400/600
Small: 13px, font-weight: 400/600/700
Tiny: 12px, font-weight: 400
```

### Spacing & Border Radius

```css
/* Border Radius */
--radius-small: 12px;
--radius-medium: 16px;
--radius-large: 20px;
--radius-xlarge: 24px;

/* Padding */
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-6: 24px;
--spacing-8: 32px;

/* Gaps */
--gap-3: 12px;
--gap-4: 16px;
--gap-6: 24px;
--gap-8: 32px;
```

### Shadows

```css
/* Card Shadow */
box-shadow: 0px 16px 35px 0px rgba(0, 0, 0, 0.04);

/* Card Hover Shadow */
box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.08);

/* Dropdown Shadow */
box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);

/* Progress Card Shadow */
box-shadow: 0px 16px 35px 0px rgba(37, 99, 235, 0.3);
```

## Component Structure

### File Location
```
/src/app/components/user-dashboard.tsx
```

### TypeScript Interfaces

```typescript
interface Session {
  id: string;
  title: string;
  providerName: string;
  providerImage: string;
  providerRole: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "upcoming";
  callLink?: string;
  linkActiveIn?: string;
}

interface UserStats {
  totalSessions: number;
  upcomingSessions: number;
  totalSpent: number;
  savedProviders: number;
}

interface Notification {
  id: string;
  type: "session" | "message" | "reminder" | "update";
  title: string;
  message: string;
  time: string;
  read: boolean;
}
```

## Layout Structure

### 1. Header Section

**Position**: Sticky at top (z-index: 10)
**Background**: White with bottom border
**Padding**: 32px horizontal, 16px vertical

#### Elements:
- **Title Area**
  - Main heading: "User Dashboard" (28px, bold)
  - Subtitle: Welcome message (15px, secondary color)

- **Action Area**
  - Search input (280px width, 44px height)
  - Notifications bell icon with badge indicator

#### Search Input
```tsx
<input
  type="text"
  placeholder="Search..."
  className="w-[280px] h-[44px] pl-10 pr-4 rounded-[12px] border border-[#eee] bg-[#f5f5f5]"
/>
```

#### Notification Badge
- Red dot indicator (8px diameter)
- Shows when unread notifications exist
- Position: absolute top-right of bell icon

---

### 2. Stats Grid

**Layout**: 4-column grid (responsive: 1 col mobile, 2 cols tablet, 4 cols desktop)
**Gap**: 24px
**Margin Bottom**: 32px

#### Stat Card Structure
```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6">
  {/* Icon Container */}
  <div className="size-12 bg-[color] rounded-[12px]">
    <Icon className="size-6" />
  </div>
  
  {/* Label */}
  <p className="text-[13px] text-[#767676]">Label</p>
  
  {/* Value */}
  <p className="text-[28px] font-bold text-[#181818]">Value</p>
</div>
```

#### Four Stats Cards:

**1. Total Sessions**
- Icon: Calendar (blue background #e3f2fd)
- Trend indicator: +12% (green)
- Icon: TrendingUp

**2. Upcoming Sessions**
- Icon: Clock (purple background #f3e8ff)
- Status badge: "Active" (blue)
- Icon: Zap

**3. Total Spent**
- Icon: DollarSign (green background #dcfce7)
- Period label: "This year"
- Value format: $3,250

**4. Saved Providers**
- Icon: Heart (red background #fee2e2)
- Simple count display

---

### 3. Quick Actions Section

**Layout**: 4-column grid
**Padding**: 24px inside white card
**Gap**: 12px between buttons

#### Action Button Types:

**Primary (Book Session)**
```tsx
<button className="flex items-center gap-3 p-4 rounded-[16px] border-2 border-dashed border-[#eee] hover:border-[#2563eb] hover:bg-[#f0f4ff] group">
  <div className="size-10 bg-[#f5f5f5] rounded-[12px] group-hover:bg-[#2563eb]">
    <Plus className="size-5 text-[#767676] group-hover:text-white" />
  </div>
  <span className="text-[15px] font-semibold">Book Session</span>
</button>
```

**Secondary Actions**
- Find Provider (Search icon)
- Messages (MessageCircle icon)
- View Calendar (Calendar icon)

All use gray background (#f5f5f5) with white icon containers

---

### 4. Main Content Grid

**Layout**: 3-column grid (2 columns left, 1 column right)
**Gap**: 32px
**Responsive**: Stacks vertically on mobile

---

### 5. Upcoming Sessions (Left Column - 2/3 width)

#### Section Header
```tsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-[24px] font-bold">Upcoming Sessions</h2>
  <button className="text-[15px] font-semibold text-[#2563eb] flex items-center gap-1">
    View all
    <ChevronRight className="size-4" />
  </button>
</div>
```

#### Session Card Structure

**Card Container**
- Border radius: 24px
- Padding: 24px
- Background: rgba(252, 252, 252, 0.95) with backdrop blur
- Border: 1px solid #eee
- Shadow: 0px 16px 35px 0px rgba(0, 0, 0, 0.04)
- Hover shadow increases

**Card Layout**
```
┌─────────────────────────────────────────┐
│ [Provider Image] [Title + Info + CTA]   │
│     (64x64px)     [Provider Name]        │
│   [Verification]  [Date & Time]          │
│                   [Duration]             │
│                   [Action Button]        │
└─────────────────────────────────────────┘
```

#### Provider Image Section
- Size: 64x64px
- Border radius: 16px
- Verification badge positioned top-right (-4px, -4px)

#### Session Info Section

**Title & Provider**
```tsx
<h3 className="text-[18px] font-semibold text-[#181818] mb-1">
  1:1 Strategy Session
</h3>
<p className="text-[14px] text-[#767676]">
  Sarah Jenkins • Senior Product Architect
</p>
```

**Status Badge**
- Confirmed: Green background (#dcfce7), green text (#16a34a)
- Upcoming: Blue background (#dbeafe), blue text (#2563eb)
- Padding: 12px horizontal, 4px vertical
- Border radius: 9999px (fully rounded)

**Meta Information**
```tsx
<div className="flex items-center gap-4 text-[14px] text-[#767676]">
  <div className="flex items-center gap-2">
    <Calendar className="size-4" />
    <span>Today, 2:00 PM - 3:00 PM</span>
  </div>
  <div className="flex items-center gap-2">
    <Clock className="size-4" />
    <span>60 mins</span>
  </div>
</div>
```

#### Action Buttons

**Active Call Button** (when callLink === "active")
```tsx
<button className="w-full bg-[#2563eb] text-white rounded-[12px] py-3 px-4 font-semibold text-[15px] hover:bg-[#1d4ed8] flex items-center justify-center gap-2">
  <Video className="size-5" />
  Join Call
</button>
```

**Inactive State** (when linkActiveIn exists)
```tsx
<div className="bg-[#f5f5f5] rounded-[12px] py-3 px-4 text-center">
  <p className="text-[14px] text-[#767676]">
    Link Active in 18h
  </p>
</div>
```

---

### 6. Your Progress Card (Right Column - 1/3 width)

**Container**
- Background: Linear gradient from #2563eb to #1d4ed8
- Border radius: 24px
- Padding: 24px
- Text color: White
- Shadow: 0px 16px 35px 0px rgba(37, 99, 235, 0.3)

#### Structure

**Icon Container**
```tsx
<div className="size-12 bg-white/20 rounded-[12px] flex items-center justify-center mb-4">
  <TrendingUp className="size-6" />
</div>
```

**Title & Description**
```tsx
<h3 className="text-[18px] font-semibold mb-2">Your Progress</h3>
<p className="text-[14px] text-white/80 mb-4">
  You've completed 24 sessions this year. Keep up the great work!
</p>
```

**Progress Bar Section**
```tsx
<div className="bg-white/20 rounded-[12px] p-4 mb-4">
  <div className="flex justify-between items-center mb-2">
    <span className="text-[13px]">Monthly Goal</span>
    <span className="text-[13px] font-semibold">3/5 Sessions</span>
  </div>
  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
    <div className="h-full bg-white rounded-full" style={{ width: "60%" }}></div>
  </div>
</div>
```

**CTA Button**
```tsx
<button className="w-full bg-white text-[#2563eb] rounded-[12px] py-3 font-semibold text-[14px] hover:bg-white/90">
  View Detailed Stats
</button>
```

---

### 7. Notifications Dropdown

**Position**: Absolute, right-aligned to notification bell
**Width**: 360px
**Max Height**: 400px (scrollable)
**Border Radius**: 16px

#### Dropdown Structure
```tsx
<div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-white rounded-[16px] border border-[#eee] shadow-lg">
  {/* Header */}
  <div className="p-4 border-b border-[#eee]">
    <h3 className="text-[16px] font-semibold">Notifications</h3>
  </div>
  
  {/* Scrollable Content */}
  <div className="max-h-[400px] overflow-y-auto">
    {/* Notification items */}
  </div>
  
  {/* Footer */}
  <div className="p-3 border-t border-[#eee]">
    <button className="w-full py-2 text-[14px] font-semibold text-[#2563eb]">
      View all notifications
    </button>
  </div>
</div>
```

#### Notification Item
```tsx
<div className={`p-4 border-b border-[#eee] hover:bg-[#f5f5f5] ${
  !notification.read ? "bg-[#f0f4ff]" : ""
}`}>
  <div className="flex items-start gap-3">
    {/* Icon */}
    <div className="size-8 rounded-full bg-[color] flex items-center justify-center">
      <Icon className="size-4" />
    </div>
    
    {/* Content */}
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-semibold text-[#181818] mb-1">Title</p>
      <p className="text-[13px] text-[#767676] mb-2">Message</p>
      <p className="text-[12px] text-[#a2a2a2]">Time</p>
    </div>
  </div>
</div>
```

#### Notification Type Colors
- **Session**: Blue (#e3f2fd background, #2563eb icon)
- **Message**: Purple (#f3e8ff background, #9333ea icon)
- **Reminder**: Yellow (#fef3c7 background, #f59e0b icon)

---

## Responsive Behavior

### Breakpoints

```css
/* Mobile */
< 640px: Single column layout, full width cards

/* Tablet */
640px - 1024px: 
  - Stats: 2 columns
  - Quick Actions: 2 columns
  - Main content: Stacked vertically

/* Desktop */
> 1024px:
  - Stats: 4 columns
  - Quick Actions: 4 columns
  - Main content: 2/3 left, 1/3 right
```

### Mobile Optimizations
- Search bar width: 100% on mobile
- Notification dropdown: Full width minus padding
- Stats cards: Stack vertically
- Session cards: Provider image slightly smaller
- Quick actions: 1-2 columns

---

## Interactive States

### Hover States

**Cards**
```css
transition: shadow 200ms ease
hover: shadow-lg
```

**Buttons**
```css
transition: all 200ms ease
Primary: bg-[#2563eb] → bg-[#1d4ed8]
Secondary: bg-[#f5f5f5] → bg-[#efefef]
```

**Quick Action (Book Session)**
```css
border: 2px dashed #eee → 2px dashed #2563eb
background: transparent → #f0f4ff
icon-bg: #f5f5f5 → #2563eb
icon-color: #767676 → white
```

### Focus States
- Search input: border-color changes to #2563eb
- Outline removed, custom focus styling applied

### Active States
- Notifications bell: Red dot indicator when unread
- Progress bar: Animated width (60% for current state)

---

## Icons Used (lucide-react)

```javascript
import {
  Calendar,      // Sessions, dates
  Clock,         // Duration, time
  TrendingUp,    // Progress, stats
  DollarSign,    // Spending
  Star,          // Ratings (future use)
  Heart,         // Saved providers
  Video,         // Video calls
  Download,      // Future use
  ChevronRight,  // Navigation
  Bell,          // Notifications
  MessageCircle, // Messages
  Plus,          // Add/Book
  Search,        // Search
  Zap            // Active status
} from "lucide-react";
```

---

## Verification Badge Component

**Purpose**: Shows verified provider status
**Size**: 20x20px
**Location**: Top-right of provider images (-4px offset)

```tsx
function VerificationIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      {/* Green gradient shield SVG */}
      <svg>
        <path fill="url(#paint0_linear_dash)" />
        <linearGradient id="paint0_linear_dash">
          <stop stopColor="#63ED67" />
          <stop offset="1" stopColor="#30C935" />
        </linearGradient>
      </svg>
      
      {/* Checkmark SVG */}
      <svg>
        <path fill="url(#paint0_linear_check_dash)" />
        <linearGradient id="paint0_linear_check_dash">
          <stop stopColor="#004703" />
          <stop offset="1" stopColor="#007004" />
        </linearGradient>
      </svg>
    </div>
  );
}
```

---

## State Management

### React State Variables

```typescript
const [activeTab, setActiveTab] = useState("dashboard");
const [showNotifications, setShowNotifications] = useState(false);
```

### Mock Data Structure

```typescript
const userStats: UserStats = {
  totalSessions: 24,
  upcomingSessions: 3,
  totalSpent: 3250,
  savedProviders: 8
};

const upcomingSessions: Session[] = [
  {
    id: "1",
    title: "1:1 Strategy Session",
    providerName: "Sarah Jenkins",
    providerImage: "...",
    providerRole: "Senior Product Architect",
    date: "Today",
    time: "2:00 PM - 3:00 PM",
    duration: 60,
    status: "confirmed",
    callLink: "active"
  },
  // ... more sessions
];

const notifications: Notification[] = [
  {
    id: "1",
    type: "session",
    title: "Session starting soon",
    message: "Your session with Sarah Jenkins starts in 30 minutes",
    time: "30m ago",
    read: false
  },
  // ... more notifications
];
```

---

## Integration Points

### API Endpoints (Future Implementation)

```typescript
// Fetch user statistics
GET /api/user/stats
Response: { totalSessions, upcomingSessions, totalSpent, savedProviders }

// Fetch upcoming sessions
GET /api/user/sessions?status=upcoming
Response: Session[]

// Fetch notifications
GET /api/user/notifications?unread=true
Response: Notification[]

// Mark notification as read
PATCH /api/user/notifications/:id
Body: { read: true }

// Join session call
GET /api/sessions/:id/join
Response: { callUrl, token }
```

---

## Accessibility Features

### ARIA Labels
```tsx
<button aria-label="Notifications">
  <Bell className="size-5" />
</button>

<button aria-label="Search dashboard">
  <Search className="size-4" />
</button>
```

### Keyboard Navigation
- All buttons focusable with Tab
- Enter/Space to activate buttons
- Escape to close notification dropdown

### Screen Reader Support
- Semantic HTML (header, main, nav, section)
- Descriptive button text
- Status badges announced properly

---

## Performance Optimizations

### Implemented
- Backdrop blur with GPU acceleration
- Transitions using transform/opacity (hardware accelerated)
- Conditional rendering of notification dropdown
- Optimized SVG icons from lucide-react

### Recommended
```typescript
// Memoize expensive computations
const unreadCount = useMemo(() => 
  notifications.filter(n => !n.read).length, 
  [notifications]
);

// Lazy load notification dropdown
const NotificationDropdown = lazy(() => 
  import('./notification-dropdown')
);

// Virtualize long notification lists
import { FixedSizeList } from 'react-window';
```

---

## Testing Checklist

### Visual Testing
- [ ] All stat cards display correctly
- [ ] Session cards show proper status badges
- [ ] Progress bar animates smoothly
- [ ] Notification badge appears when unread
- [ ] Hover states work on all interactive elements
- [ ] Verification badges appear on provider images

### Responsive Testing
- [ ] Mobile: Single column layout
- [ ] Tablet: 2-column stats grid
- [ ] Desktop: Full 3-column layout
- [ ] Search bar adapts to screen size
- [ ] Notification dropdown doesn't overflow

### Interaction Testing
- [ ] Notifications dropdown opens/closes
- [ ] "Join Call" button for active sessions
- [ ] "Link Active in" shows for upcoming sessions
- [ ] All quick action buttons clickable
- [ ] "View all" links functional

### State Testing
- [ ] Unread notification count updates
- [ ] Progress bar width matches percentage
- [ ] Session status badges match data
- [ ] Notification dropdown closes on outside click

---

## Common Customizations

### Change Color Scheme
```typescript
// Replace primary blue
--primary: #2563eb → #your-color
--primary-dark: #1d4ed8 → #your-color-dark

// Update stat card colors
bg-[#e3f2fd] → bg-[your-color-light]
text-[#2563eb] → text-[your-color]
```

### Add New Stat Card
```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6">
  <div className="flex items-center justify-between mb-4">
    <div className="size-12 bg-[#color-light] rounded-[12px] flex items-center justify-center">
      <YourIcon className="size-6 text-[#color]" />
    </div>
    <div className="flex items-center gap-1 text-[#color] text-[13px] font-semibold">
      Badge Text
    </div>
  </div>
  <p className="text-[13px] text-[#767676] mb-1">Label</p>
  <p className="text-[28px] font-bold text-[#181818]">{value}</p>
</div>
```

### Modify Progress Card Content
```tsx
// Change goal type
<span className="text-[13px]">Weekly Goal</span>
<span className="text-[13px] font-semibold">10/15 Sessions</span>

// Adjust progress percentage
style={{ width: "66%" }} // For 10/15 = 66%
```

### Add Quick Action
```tsx
<button className="flex items-center gap-3 p-4 rounded-[16px] bg-[#f5f5f5] hover:bg-[#efefef]">
  <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
    <YourIcon className="size-5 text-[#767676]" />
  </div>
  <span className="text-[15px] font-semibold text-[#181818]">Your Action</span>
</button>
```

---

## Future Enhancements

### Planned Features
1. **Calendar View Integration**
   - Full calendar showing all sessions
   - Drag-and-drop rescheduling
   - Multi-day view

2. **Analytics Dashboard**
   - Session completion rate
   - Spending trends over time
   - Category breakdown charts
   - Provider rating distribution

3. **Message Center**
   - Real-time chat with providers
   - File sharing
   - Message history

4. **Session History**
   - Completed sessions list
   - Session recordings/notes
   - Downloadable receipts
   - Review/rating system

5. **Advanced Filters**
   - Filter sessions by provider
   - Filter by date range
   - Filter by status

6. **Achievements/Badges**
   - Milestone celebrations
   - Streak tracking
   - Gamification elements

7. **Wallet/Credits System**
   - Balance display
   - Transaction history
   - Add credits/payment methods

8. **Referral Program**
   - Shareable referral links
   - Referral rewards tracking
   - Social sharing

---

## Component Export

```typescript
// File: /src/app/components/user-dashboard.tsx
export function UserDashboard() {
  // Component implementation
}

// Usage in App.tsx
import { UserDashboard } from "@/app/components/user-dashboard";

export default function App() {
  return <UserDashboard />;
}
```

---

## Dependencies

### Required Packages
```json
{
  "lucide-react": "^0.x.x",  // Icon library
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
- Safari: Full support (backdrop-filter requires prefix in older versions)
- Mobile Safari: Full support
- Chrome Mobile: Full support

---

## Design Principles

1. **Consistency**: Follows the same design language as marketplace and profile pages
2. **Clarity**: Clear visual hierarchy with proper spacing
3. **Responsiveness**: Mobile-first approach, scales up gracefully
4. **Performance**: Optimized animations and transitions
5. **Accessibility**: Keyboard navigation, screen reader friendly
6. **Feedback**: Clear hover/focus states on all interactive elements

---

## Maintenance Notes

### Regular Updates Needed
- Session data refresh (real-time or polling)
- Notification badge updates
- Stats counter updates
- Progress bar recalculation

### Code Quality
- All TypeScript interfaces defined
- Proper prop typing
- Consistent naming conventions
- Component modularity maintained

---

## Support & Resources

For questions or issues:
1. Check this documentation first
2. Review the marketplace and profile guides for design consistency
3. Refer to Tailwind CSS v4 documentation for styling
4. Check lucide-react for icon options

---

**Last Updated**: January 2026
**Version**: 1.0
**Component**: UserDashboard
**Design System**: ProSupport Marketplace
