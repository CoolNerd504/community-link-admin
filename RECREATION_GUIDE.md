# Service Provider Marketplace - Recreation Guide

This comprehensive guide will walk you through recreating the service provider marketplace with grid and list views from scratch.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Data Structure](#data-structure)
5. [Component Architecture](#component-architecture)
6. [Step-by-Step Implementation](#step-by-step-implementation)
7. [Styling Guidelines](#styling-guidelines)
8. [Features & Interactions](#features--interactions)

---

## Project Overview

This is a responsive service provider marketplace that displays approved providers with their services, ratings, and profiles. Users can toggle between grid and list views, search providers, and interact with favorites and follow buttons.

### Key Features
- **Dual View Modes**: Grid view (cards) and List view (horizontal layout)
- **Search Functionality**: Filter providers by name, headline, services, or categories
- **Interactive Elements**: Favorite and follow buttons with state management
- **Responsive Design**: Adapts to different screen sizes
- **Provider Verification**: Visual indicators for verified providers
- **Online Status**: Real-time online/offline indicators
- **Rich Provider Data**: Ratings, reviews, services, hourly rates, languages

---

## Prerequisites

### Required Dependencies
```json
{
  "lucide-react": "^0.487.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

### Project Structure
```
src/
├── app/
│   ├── App.tsx                          # Main application component
│   └── components/
│       ├── provider-card.tsx            # Grid view card component
│       └── provider-list-item.tsx       # List view item component
├── imports/
│   └── svg-kgp0lgcn47.ts               # SVG paths for verification badge
└── styles/
    ├── tailwind.css
    └── theme.css
```

---

## Data Structure

### TypeScript Interfaces

```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;         // in minutes
  category: string;
}

interface Profile {
  bio: string;
  headline: string;
  location: string;
  languages: string[];
  hourlyRate: number;
  isOnline: boolean;
  isAvailableForInstant: boolean;
  interests: string[];
}

interface Provider {
  id: string;
  name: string;
  email: string;
  image: string;           // URL to profile image
  role: string;            // "PROVIDER"
  username: string;
  kycStatus: string;       // "VERIFIED" or other
  rating: number;          // 0-5
  reviewCount: number;
  isFavorite: boolean;
  isFollowing: boolean;
  profile: Profile;
  services: Service[];
}
```

### API Response Structure

The component expects data matching this structure from an API endpoint with the following query parameters:
- `q` - Search query (name, service titles)
- `category` - Filter by service category
- `minPrice` / `maxPrice` - Price range filtering

**Response includes:**
- User fields: id, name, email, image, role, username, kycStatus
- Calculated fields: rating (0-5), reviewCount, isFavorite, isFollowing
- Profile object: bio, headline, location, languages, hourlyRate, isOnline, isAvailableForInstant, interests
- Services array: All active & approved services

**Key Requirements:**
- Only shows APPROVED providers with role: "PROVIDER"
- Calculates average rating from reviews
- Includes favorite/following status for logged-in users
- Filters services by active & approved status

---

## Component Architecture

### 1. Main App Component (`/src/app/App.tsx`)

**Responsibilities:**
- State management for view mode, providers, and search
- Rendering grid or list view based on state
- Search filtering logic
- Header and controls

**State Variables:**
```typescript
const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
const [providers, setProviders] = useState<Provider[]>(mockProviders);
const [searchQuery, setSearchQuery] = useState("");
```

**Key Functions:**
- `handleToggleFavorite(id: string)` - Toggle favorite status
- `handleToggleFollow(id: string)` - Toggle follow status
- `filteredProviders` - Computed filtered list based on search

### 2. Provider Card Component (`/src/app/components/provider-card.tsx`)

**For Grid View Display**

**Props:**
```typescript
interface ProviderCardProps {
  provider: Provider;
  onToggleFavorite: (id: string) => void;
  onToggleFollow: (id: string) => void;
}
```

**Card Dimensions:**
- Width: 360px (max-w-[360px])
- Image: 360px × 336px
- Border radius: 40px
- Background: rgba(252,252,252,0.95) with 16px backdrop blur

**Layout Sections:**
1. **Profile Image** (360×336px)
   - Rounded 32px corners
   - Online badge (top-right)
   - Favorite button (top-left)

2. **User Info Section** (padding: 24px vertical, 28px horizontal)
   - Name + verification badge
   - Headline (line-clamp-2)
   - Location + rating
   - Hourly rate

3. **Stats & Actions** (padding-bottom: 28px)
   - Service count
   - Follow button

### 3. Provider List Item Component (`/src/app/components/provider-list-item.tsx`)

**For List View Display**

**Props:** Same as ProviderCard

**Layout:**
- Horizontal flexbox layout
- Profile image: 120×120px on left
- Content section takes remaining space
- Action buttons on right

**Key Differences from Card:**
- Horizontal orientation
- Displays more information (languages, service tags)
- Shows up to 3 service categories as tags
- Compact spacing for efficiency

### 4. Verification Icon Component

**Shared SVG Component** for verified badge

Displays a green star with checkmark for verified providers. Uses SVG paths imported from `/src/imports/svg-kgp0lgcn47.ts`.

---

## Step-by-Step Implementation

### Step 1: Create SVG Asset File

Create `/src/imports/svg-kgp0lgcn47.ts`:

```typescript
export default {
  p3d7f7000: "M11.7318 0L14.5909...", // Star path
  p3ab02e00: "M10.9957 4.29707..."   // Checkmark path
};
```

### Step 2: Create Provider Card Component

File: `/src/app/components/provider-card.tsx`

**Key Implementation Points:**

1. **Import Dependencies:**
```typescript
import svgPaths from "@/imports/svg-kgp0lgcn47";
import { Star, MapPin, Heart, UserPlus } from "lucide-react";
```

2. **Verification Icon Component:**
```typescript
function VerificationIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      {/* SVG implementation with gradient */}
    </div>
  );
}
```

3. **Card Structure:**
```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[40px] w-full max-w-[360px] relative">
  {/* Profile Image Section */}
  {/* User Info Section */}
  {/* Stats & Actions Section */}
  {/* Border overlay */}
</div>
```

4. **Interactive Elements:**
- Favorite button with conditional styling
- Follow/Following button with state
- Online status badge

### Step 3: Create Provider List Item Component

File: `/src/app/components/provider-list-item.tsx`

**Key Differences:**

1. **Horizontal Layout:**
```tsx
<div className="flex gap-6 p-6">
  <div className="relative shrink-0">
    {/* 120x120 image */}
  </div>
  <div className="flex-1 min-w-0">
    {/* Content */}
  </div>
</div>
```

2. **Service Tags:**
```tsx
<div className="flex flex-wrap gap-2 mb-3">
  {provider.services.slice(0, 3).map((service) => (
    <span className="px-3 py-1 bg-[#efefef] rounded-full text-[13px]">
      {service.category}
    </span>
  ))}
</div>
```

### Step 4: Create Main App Component

File: `/src/app/App.tsx`

**1. Setup State:**
```typescript
const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
const [providers, setProviders] = useState<Provider[]>(mockProviders);
const [searchQuery, setSearchQuery] = useState("");
```

**2. Implement Toggle Handlers:**
```typescript
const handleToggleFavorite = (id: string) => {
  setProviders(prev =>
    prev.map(provider =>
      provider.id === id
        ? { ...provider, isFavorite: !provider.isFavorite }
        : provider
    )
  );
};
```

**3. Search Filter Logic:**
```typescript
const filteredProviders = providers.filter(provider =>
  provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  provider.profile.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
  provider.services.some(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  )
);
```

**4. Header Section:**
```tsx
<div className="mb-8">
  <h1 className="text-[42px] font-bold text-[#181818] mb-2">
    Service Providers
  </h1>
  <p className="text-[18px] text-[#767676]">
    Browse through our approved providers...
  </p>
</div>
```

**5. Controls Section:**
```tsx
{/* Search Input */}
<input
  type="text"
  placeholder="Search providers, services, or categories..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full h-[52px] pl-12 pr-4 rounded-[16px]..."
/>

{/* View Toggle Buttons */}
<button onClick={() => setViewMode("grid")}>
  <Grid3x3 className="size-5" />
  <span>Grid</span>
</button>
```

**6. Conditional Rendering:**
```tsx
{viewMode === "grid" ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-12">
    {filteredProviders.map((provider) => (
      <ProviderCard ... />
    ))}
  </div>
) : (
  <div className="flex flex-col gap-4">
    {filteredProviders.map((provider) => (
      <ProviderListItem ... />
    ))}
  </div>
)}
```

### Step 5: Create Mock Data

Include 6+ provider objects with complete data:

```typescript
const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Sophie Bennett",
    email: "sophie@example.com",
    image: "...",
    role: "PROVIDER",
    username: "sophieb",
    kycStatus: "VERIFIED",
    rating: 4.9,
    reviewCount: 127,
    isFavorite: false,
    isFollowing: false,
    profile: {
      bio: "...",
      headline: "Product Designer who focuses on simplicity & usability.",
      location: "San Francisco, CA",
      languages: ["English", "Spanish"],
      hourlyRate: 85,
      isOnline: true,
      isAvailableForInstant: true,
      interests: ["UI/UX", "Product Strategy"]
    },
    services: [
      {
        id: "s1",
        title: "UX Audit & Consultation",
        description: "...",
        price: 500,
        duration: 60,
        category: "UX Design"
      }
      // ... more services
    ]
  }
  // ... more providers
];
```

---

## Styling Guidelines

### Color Palette

```css
/* Primary */
--background: #f5f5f5
--card-bg: rgba(252, 252, 252, 0.95)
--text-primary: #181818
--text-secondary: #767676
--text-muted: #a2a2a2

/* Accents */
--border: #eeeeee
--button-bg: #efefef
--online-green: #22c55e
--rating-yellow: #facc15
--favorite-red: #ef4444
```

### Typography

- **Headings**: SF Pro Display Medium (or sans-serif fallback)
- **Body**: SF Pro Text Regular (or sans-serif fallback)
- **Main Title**: 42px bold
- **Card Name**: 22px medium
- **Headline**: 15px regular
- **Body Text**: 14-15px

### Spacing System

- **Card Gap**: 48px (gap-12) horizontal and vertical
- **Card Padding**: 24-28px
- **Section Gaps**: 4px, 8px for tight spacing
- **Margin Between Sections**: 24px

### Border Radius

- **Cards**: 40px
- **Images**: 32px
- **Buttons**: 16-32px
- **Badges**: Full (rounded-full)

### Shadows

Card shadow:
```css
box-shadow: 
  0px 393px 110px 0px rgba(0,0,0,0),
  0px 252px 101px 0px rgba(0,0,0,0.01),
  0px 142px 85px 0px rgba(0,0,0,0.02),
  0px 63px 63px 0px rgba(0,0,0,0.04),
  0px 16px 35px 0px rgba(0,0,0,0.04);
```

---

## Features & Interactions

### 1. View Toggle

**Grid View:**
- 4 columns on XL screens (xl:grid-cols-4)
- 3 columns on large screens (lg:grid-cols-3)
- 2 columns on small screens (sm:grid-cols-2)
- 1 column on mobile
- 48px gap between cards

**List View:**
- Single column
- 16px gap between items
- Horizontal card layout

### 2. Search Functionality

**Searches across:**
- Provider name
- Profile headline
- Service titles
- Service categories

**Features:**
- Real-time filtering (no submit button)
- Case-insensitive matching
- Shows result count
- Empty state when no matches

### 3. Favorite Button

**Behavior:**
- Click to toggle favorite status
- Visual feedback with red heart fill
- Maintains state across view changes
- Located top-left of image in grid, top-right in list

### 4. Follow Button

**States:**
- "Follow" - Default state, gray background
- "Following" - Active state, black background
- Includes UserPlus icon when not following
- Maintains state across view changes

### 5. Online Status

**Indicators:**
- Green badge labeled "Online" on grid view cards
- Green dot on list view profile images
- Only shown when `profile.isOnline === true`

### 6. Verification Badge

**Display:**
- Green star with checkmark SVG
- Shown next to name when `kycStatus === "VERIFIED"`
- Scales appropriately for grid (24px) and list (20px) views

### 7. Rating Display

**Format:**
- Star icon (filled yellow)
- Rating number (1 decimal place)
- Review count in parentheses
- Only shown when rating > 0

### 8. Responsive Behavior

**Breakpoints:**
- Mobile: Single column, full-width cards
- SM (640px): 2 columns in grid
- LG (1024px): 3 columns in grid
- XL (1280px): 4 columns in grid

**Search Bar:**
- Full width on mobile
- 400px fixed width on desktop

---

## Advanced Customization

### Connecting to Real API

Replace mock data with API call:

```typescript
useEffect(() => {
  async function fetchProviders() {
    const response = await fetch('/api/providers?role=PROVIDER&status=APPROVED');
    const data = await response.json();
    setProviders(data);
  }
  fetchProviders();
}, []);
```

### Adding Filters

Add category and price range filters:

```typescript
const [categoryFilter, setCategoryFilter] = useState<string>("");
const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

const filteredProviders = providers.filter(provider => {
  const matchesSearch = /* search logic */;
  const matchesCategory = !categoryFilter || 
    provider.services.some(s => s.category === categoryFilter);
  const matchesPrice = provider.profile.hourlyRate >= priceRange.min && 
    provider.profile.hourlyRate <= priceRange.max;
  
  return matchesSearch && matchesCategory && matchesPrice;
});
```

### Pagination

Add pagination for large datasets:

```typescript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 12;

const paginatedProviders = filteredProviders.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
```

### Sorting Options

```typescript
const [sortBy, setSortBy] = useState<"rating" | "price" | "reviews">("rating");

const sortedProviders = [...filteredProviders].sort((a, b) => {
  switch(sortBy) {
    case "rating": return b.rating - a.rating;
    case "price": return a.profile.hourlyRate - b.profile.hourlyRate;
    case "reviews": return b.reviewCount - a.reviewCount;
  }
});
```

---

## Performance Optimizations

### 1. Image Optimization
- Use lazy loading: `loading="lazy"`
- Optimize image sizes (use appropriate resolutions)
- Consider using next/image or similar for optimization

### 2. Memoization
```typescript
const filteredProviders = useMemo(() => 
  providers.filter(/* filter logic */),
  [providers, searchQuery]
);
```

### 3. Virtual Scrolling
For large lists (1000+ items), implement virtual scrolling with libraries like `react-virtual`

---

## Accessibility Checklist

- [ ] All images have descriptive `alt` attributes
- [ ] Buttons have clear labels and focus states
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announcements for state changes
- [ ] ARIA labels for icon-only buttons
- [ ] Focus visible on all focusable elements

---

## Testing Recommendations

### Unit Tests
- Test toggle functions (favorite, follow)
- Test search filtering logic
- Test view mode switching

### Integration Tests
- Test complete user flows (search → view card → favorite)
- Test responsive behavior at different breakpoints
- Test empty states

### Visual Regression Tests
- Capture screenshots of both views
- Test across different browsers
- Verify responsive layouts

---

## Deployment Checklist

- [ ] Replace mock data with real API endpoints
- [ ] Add error handling for failed API calls
- [ ] Add loading states
- [ ] Optimize images
- [ ] Enable production builds
- [ ] Test on multiple devices/browsers
- [ ] Set up analytics tracking
- [ ] Configure CORS for API calls
- [ ] Add rate limiting if needed
- [ ] Set up monitoring and error logging

---

## Common Issues & Solutions

### Issue: Cards don't align properly in grid
**Solution:** Ensure parent container uses `justify-center` and cards have `max-w-[360px]`

### Issue: Search doesn't work
**Solution:** Check that `searchQuery` is correctly lowercase compared

### Issue: Images don't load
**Solution:** Verify image URLs are valid and accessible, use ImageWithFallback component

### Issue: Verification badge doesn't show
**Solution:** Ensure SVG paths are correctly imported and `kycStatus === "VERIFIED"`

### Issue: Responsive grid breaks
**Solution:** Check Tailwind breakpoint classes are correctly applied (sm:, lg:, xl:)

---

## Next Steps & Enhancements

1. **Add Provider Detail Page**: Click card to view full profile
2. **Implement Messaging**: Allow users to contact providers
3. **Add Booking System**: Enable instant booking for available providers
4. **User Preferences**: Save favorite view mode
5. **Advanced Filters**: Location radius, availability, ratings
6. **Social Features**: Share profiles, recommendations
7. **Review System**: Display and submit reviews
8. **Notifications**: Follow updates, new services

---

## Conclusion

This guide provides a complete blueprint for recreating the service provider marketplace. The implementation focuses on clean code, reusable components, and excellent user experience across devices. Follow the steps in order, paying attention to the exact dimensions, colors, and spacing to match the original design.

For questions or contributions, refer to the component files and use this guide as your reference documentation.
