# Service Provider Profile Page - Recreation Guide

This comprehensive guide will walk you through recreating the service provider profile page with complete detail view from scratch.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Page Structure](#page-structure)
4. [Data Structure](#data-structure)
5. [Component Architecture](#component-architecture)
6. [Step-by-Step Implementation](#step-by-step-implementation)
7. [Styling Guidelines](#styling-guidelines)
8. [Features & Interactions](#features--interactions)
9. [Integration with Marketplace](#integration-with-marketplace)

---

## Project Overview

This is a comprehensive profile page for service providers that displays detailed information about their experience, services, reviews, and availability. The page uses the same design language as the marketplace grid/list views for consistency.

### Key Features
- **Breadcrumb Navigation**: Easy navigation back to marketplace
- **3-Column Responsive Layout**: Profile card, main content, booking sidebar
- **Tabbed Interface**: About, Services, Reviews, Experience
- **Interactive Booking**: Instant connect and scheduling options
- **Social Actions**: Save and share functionality
- **Rich Provider Details**: Complete professional profile with verification

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
│   ├── App.tsx                          # Main application with routing
│   └── components/
│       ├── profile-page.tsx             # Profile page component
│       ├── provider-card.tsx            # Grid view card (marketplace)
│       └── provider-list-item.tsx       # List view item (marketplace)
└── imports/
    └── svg-kgp0lgcn47.ts               # SVG paths for verification badge
```

---

## Page Structure

### Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home / Category / Provider Name                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────┐  ┌──────────────────────┐  ┌───────────┐  │
│  │            │  │                      │  │           │  │
│  │  Profile   │  │   Tab Navigation     │  │  Booking  │  │
│  │   Card     │  │   ┌──────────────┐   │  │  Section  │  │
│  │            │  │   │              │   │  │           │  │
│  │  - Image   │  │   │ Tab Content  │   │  │ Available │  │
│  │  - Name    │  │   │   (About,    │   │  │   Now     │  │
│  │  - Badges  │  │   │   Services,  │   │  │           │  │
│  │  - Info    │  │   │   Reviews,   │   │  │  Connect  │  │
│  │  - Stats   │  │   │   Exp)       │   │  │  Button   │  │
│  │            │  │   │              │   │  │           │  │
│  └────────────┘  │   └──────────────┘   │  │ Schedule  │  │
│   (340px)       │                      │  │  Button   │  │
│                  │    (Main Content)    │  │           │  │
│   Sticky         │                      │  │ Save/Share│  │
│                  └──────────────────────┘  └───────────┘  │
│                                              (340px)      │
│                                              Sticky        │
└─────────────────────────────────────────────────────────────┘
        Max Width: 1400px with 32px padding
```

### Responsive Breakpoints

- **Mobile (< 1024px)**: Single column, stacked layout
- **Desktop (>= 1024px)**: 3-column layout with sticky sidebars

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
  deliveryType: "video" | "written" | "both";
}

interface Review {
  id: string;
  userName: string;
  userImage: string;        // URL to reviewer's image
  rating: number;           // 1-5
  comment: string;
  date: string;            // e.g., "2 days ago"
}

interface Profile {
  bio: string;             // Full biography
  headline: string;        // Short professional headline
  location: string;        // City, State/Country
  languages: string[];     // e.g., ["English", "Spanish"]
  hourlyRate: number;
  isOnline: boolean;
  isAvailableForInstant: boolean;
  interests: string[];     // Specializations/skills
  timezone: string;        // e.g., "GMT-7 (PDT)"
}

interface Provider {
  id: string;
  name: string;
  email: string;
  image: string;           // Profile image URL
  role: string;            // "PROVIDER"
  username: string;
  kycStatus: string;       // "VERIFIED" or other
  rating: number;          // 0-5
  reviewCount: number;
  isFavorite: boolean;
  isFollowing: boolean;
  profile: Profile;
  services: Service[];
  reviews: Review[];       // Array of reviews
  sessions: number;        // Total completed sessions
  experience: number;      // Years of experience
}
```

### Component Props

```typescript
interface ProfilePageProps {
  provider: Provider;
  onBack?: () => void;    // Navigation handler
}
```

---

## Component Architecture

### Main Profile Page Component

File: `/src/app/components/profile-page.tsx`

**State Management:**
```typescript
const [activeTab, setActiveTab] = useState<"about" | "services" | "reviews" | "experience">("about");
const [isSaved, setIsSaved] = useState(provider.isFavorite);
```

**Layout Sections:**

1. **Breadcrumb Bar** (Full width, sticky top)
2. **Left Sidebar** - Profile Card (340px, sticky)
3. **Main Content** - Tabbed interface (flexible width)
4. **Right Sidebar** - Booking actions (340px, sticky)

---

## Step-by-Step Implementation

### Step 1: Create the Verification Icon Component

This is shared with the marketplace components.

```typescript
function VerificationIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute h-[23.178px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[23.464px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4636 23.1784">
          <path d={svgPaths.p3d7f7000} fill="url(#paint0_linear_profile)" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_profile" x1="11.7318" x2="11.7318" y1="-3.4849e-08" y2="23.1784">
              <stop stopColor="#63ED67" />
              <stop offset="1" stopColor="#30C935" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Checkmark SVG inside */}
    </div>
  );
}
```

**Key Points:**
- Uses imported SVG paths from `/src/imports/svg-kgp0lgcn47.ts`
- Green gradient from #63ED67 to #30C935
- Unique gradient IDs to avoid conflicts

### Step 2: Create the Breadcrumb Navigation

```tsx
<div className="bg-white border-b border-[#eee]">
  <div className="max-w-[1400px] mx-auto px-8 py-4">
    <div className="flex items-center gap-2 text-[14px]">
      <button onClick={onBack} className="text-[#767676] hover:text-[#181818]">
        Home
      </button>
      <span className="text-[#a2a2a2]">/</span>
      <span className="text-[#767676]">{provider.profile.interests[0]}</span>
      <span className="text-[#a2a2a2]">/</span>
      <span className="text-[#181818] font-semibold">{provider.name}</span>
    </div>
  </div>
</div>
```

**Design Specs:**
- Background: White
- Border: 1px solid #eee (bottom only)
- Padding: 16px vertical, 32px horizontal
- Max width: 1400px
- Font size: 14px
- Separator: "/" in #a2a2a2

### Step 3: Create the Left Sidebar - Profile Card

**Structure:**

```tsx
<div className="lg:sticky lg:top-8 h-fit">
  <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[40px] border border-[#eee]">
    <div className="flex flex-col items-center p-8">
      {/* Profile Image */}
      {/* Name & Title */}
      {/* Badges */}
      {/* Info Items */}
      {/* Stats Grid */}
    </div>
  </div>
</div>
```

#### Profile Image Section

```tsx
<div className="relative mb-6">
  <div className="h-[200px] w-[200px] rounded-[32px] overflow-hidden">
    <img alt={provider.name} className="h-full w-full object-cover" src={provider.image} />
  </div>
  {provider.kycStatus === "VERIFIED" && (
    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
      <VerificationIcon />
    </div>
  )}
</div>
```

**Specs:**
- Image size: 200×200px
- Border radius: 32px
- Verification badge: positioned absolute, -8px bottom and right
- Badge background: White with 4px padding

#### Name & Headline

```tsx
<h1 className="text-[24px] font-bold text-[#181818] text-center mb-2">
  {provider.name}
</h1>
<p className="text-[15px] text-[#767676] text-center mb-6">
  {provider.profile.headline}
</p>
```

#### Badges Section

```tsx
<div className="flex gap-2 mb-6">
  <div className="bg-[#e3f2fd] text-[#1976d2] px-3 py-1.5 rounded-full text-[13px] font-semibold flex items-center gap-1">
    <Star className="size-3.5 fill-current" />
    Top Rated
  </div>
  <div className="bg-[#e8f5e9] text-[#2e7d32] px-3 py-1.5 rounded-full text-[13px] font-semibold">
    Fast Responder
  </div>
</div>
```

**Badge Color System:**
- **Top Rated**: Background #e3f2fd, Text #1976d2 (Blue)
- **Fast Responder**: Background #e8f5e9, Text #2e7d32 (Green)
- Border radius: Full (rounded-full)
- Padding: 12px horizontal, 6px vertical
- Font size: 13px, semibold

#### Info Items

```tsx
<div className="w-full space-y-4 mb-6">
  <div className="flex items-center gap-3 text-[14px]">
    <MapPin className="size-4 text-[#767676]" />
    <span className="text-[#181818]">{provider.profile.location}</span>
  </div>
  <div className="flex items-center gap-3 text-[14px]">
    <Globe className="size-4 text-[#767676]" />
    <span className="text-[#181818]">{provider.profile.languages.join(", ")}</span>
  </div>
  <div className="flex items-center gap-3 text-[14px]">
    <Clock className="size-4 text-[#767676]" />
    <span className="text-[#181818]">{provider.profile.timezone}</span>
  </div>
</div>
```

**Icons from lucide-react:**
- MapPin - Location
- Globe - Languages
- Clock - Timezone

**Spacing:**
- Gap between icon and text: 12px
- Gap between items: 16px
- Icon size: 16px
- Icon color: #767676

#### Divider

```tsx
<div className="w-full h-[1px] bg-[#eee] mb-6"></div>
```

#### Stats Grid

```tsx
<div className="w-full grid grid-cols-3 gap-4 mb-6">
  <div className="text-center">
    <div className="text-[20px] font-bold text-[#181818]">{provider.sessions}+</div>
    <div className="text-[12px] text-[#767676]">Sessions</div>
  </div>
  <div className="text-center">
    <div className="text-[20px] font-bold text-[#181818]">{provider.experience}</div>
    <div className="text-[12px] text-[#767676]">Years</div>
  </div>
  <div className="text-center">
    <div className="text-[20px] font-bold text-[#181818] flex items-center justify-center gap-1">
      {provider.rating}
      <Star className="size-4 fill-yellow-400 text-yellow-400" />
    </div>
    <div className="text-[12px] text-[#767676]">Rating</div>
  </div>
</div>
```

**Specs:**
- 3 equal columns
- Number font size: 20px, bold
- Label font size: 12px
- Text align: center
- Star icon: 16px, filled yellow

### Step 4: Create the Tab Navigation

```tsx
<div className="bg-white rounded-[24px] border border-[#eee] p-2 flex gap-2">
  {[
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "reviews", label: "Reviews" },
    { id: "experience", label: "Experience" }
  ].map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id as any)}
      className={`flex-1 px-6 py-3 rounded-[16px] text-[15px] font-semibold transition-colors ${
        activeTab === tab.id
          ? "bg-[#181818] text-white"
          : "text-[#767676] hover:text-[#181818]"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>
```

**Tab Design:**
- **Container**: White background, 24px border radius, 8px padding
- **Active Tab**: Black background (#181818), white text
- **Inactive Tab**: Gray text (#767676), transparent background
- **Hover State**: Text changes to #181818
- **Transition**: Smooth color transitions
- **Layout**: Flex with equal widths
- **Button Padding**: 24px horizontal, 12px vertical

### Step 5: Create Tab Content - About

```tsx
{activeTab === "about" && (
  <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[32px] border border-[#eee] p-8">
    <h2 className="text-[28px] font-bold text-[#181818] mb-4">
      About {provider.name.split(" ")[0]}
    </h2>
    <div className="text-[15px] text-[#181818] leading-[1.7] space-y-4">
      <p>{provider.profile.bio}</p>
      {/* Additional paragraphs */}
    </div>

    {/* Specializations */}
    <div className="mt-8">
      <h3 className="text-[18px] font-semibold text-[#181818] mb-4">Specializations</h3>
      <div className="flex flex-wrap gap-2">
        {provider.profile.interests.map((interest, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-[#efefef] rounded-full text-[14px] text-[#181818]"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  </div>
)}
```

**About Section Specs:**
- Card padding: 32px
- Heading: 28px, bold
- Body text: 15px, line-height 1.7
- Paragraph spacing: 16px
- Section margin top: 32px
- Tags: #efefef background, full rounded, 16px horizontal padding

### Step 6: Create Tab Content - Services

```tsx
{activeTab === "services" && (
  <div className="space-y-4">
    <h2 className="text-[28px] font-bold text-[#181818]">Services Offered</h2>
    {provider.services.map((service) => (
      <div
        key={service.id}
        className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-[20px] font-semibold text-[#181818] mb-2">
              {service.title}
            </h3>
            <p className="text-[15px] text-[#767676]">{service.description}</p>
          </div>
          <div className="text-right ml-6">
            <div className="text-[24px] font-bold text-[#181818]">
              ${service.price}
              <span className="text-[16px] font-normal text-[#767676]">/hr</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[14px]">
          <div className="flex items-center gap-2 text-[#767676]">
            <Clock className="size-4" />
            <span>{service.duration} mins</span>
          </div>
          <div className="flex items-center gap-2 text-[#767676]">
            {service.deliveryType === "video" ? (
              <>
                <Video className="size-4" />
                <span>Video Call</span>
              </>
            ) : service.deliveryType === "written" ? (
              <>
                <FileText className="size-4" />
                <span>Written Feedback</span>
              </>
            ) : (
              <>
                <MessageCircle className="size-4" />
                <span>Video & Written</span>
              </>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
```

**Service Card Specs:**
- Card padding: 24px
- Border radius: 24px
- Hover effect: Elevated shadow
- Title: 20px, semibold
- Price: 24px, bold
- Description: 15px, #767676
- Meta info: 14px with icons
- Icon size: 16px

**Delivery Type Icons:**
- Video: `<Video />` icon
- Written: `<FileText />` icon
- Both: `<MessageCircle />` icon

### Step 7: Create Tab Content - Reviews

```tsx
{activeTab === "reviews" && (
  <div className="space-y-6">
    <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[32px] border border-[#eee] p-8">
      {/* Review Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[28px] font-bold text-[#181818]">Client Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`size-5 ${
                  i < Math.floor(provider.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-[20px] font-bold text-[#181818]">{provider.rating}</span>
          <span className="text-[15px] text-[#767676]">({provider.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {provider.reviews.map((review) => (
          <div key={review.id} className="border-t border-[#eee] pt-6 first:border-0 first:pt-0">
            <div className="flex gap-4">
              <img
                src={review.userImage}
                alt={review.userName}
                className="size-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[16px] font-semibold text-[#181818]">{review.userName}</h4>
                  <span className="text-[13px] text-[#767676]">{review.date}</span>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[15px] text-[#181818] italic leading-[1.6]">"{review.comment}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <button className="w-full mt-6 py-4 border border-[#eee] rounded-[16px] text-[15px] font-semibold text-[#181818] hover:bg-[#f5f5f5] transition-colors">
        Read All {provider.reviewCount} Reviews
      </button>
    </div>
  </div>
)}
```

**Review Card Specs:**
- User image: 48×48px, circular
- User name: 16px, semibold
- Date: 13px, gray
- Star rating: 16px stars
- Comment: 15px, italic, line-height 1.6
- Divider between reviews: 1px #eee
- First review has no top border

**Rating Display:**
- Overall rating: 20px, bold
- Star size: 20px (header), 16px (individual reviews)
- Filled stars: #facc15 (yellow-400)
- Empty stars: #d1d5db (gray-300)

### Step 8: Create Tab Content - Experience

```tsx
{activeTab === "experience" && (
  <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[32px] border border-[#eee] p-8">
    <h2 className="text-[28px] font-bold text-[#181818] mb-6">Experience</h2>
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="size-12 bg-[#efefef] rounded-[12px] flex items-center justify-center text-[20px] font-bold text-[#181818]">
            G
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-[#181818]">Senior UX Design Lead</h3>
          <p className="text-[15px] text-[#767676] mb-1">Google</p>
          <p className="text-[14px] text-[#a2a2a2]">2018 - Present · 6 years</p>
          <p className="text-[15px] text-[#181818] mt-3">
            Leading design for several high-growth startups, focusing on user experience and design systems.
          </p>
        </div>
      </div>
    </div>
  </div>
)}
```

**Experience Card Specs:**
- Company logo: 48×48px, 12px border radius, #efefef background
- Logo text: 20px, bold, centered
- Job title: 18px, semibold
- Company name: 15px, #767676
- Duration: 14px, #a2a2a2
- Description: 15px, margin-top 12px

### Step 9: Create the Right Sidebar - Booking Section

**Availability Card:**

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6">
  <div className="flex items-center gap-2 mb-4">
    <div className="size-3 bg-green-500 rounded-full"></div>
    <span className="text-[15px] font-semibold text-[#181818]">Available Now</span>
  </div>
  <p className="text-[14px] text-[#767676] mb-6">
    {provider.name.split(" ")[0]} is currently online and typically responds in less than 5 minutes.
  </p>
  <button className="w-full bg-[#181818] text-white rounded-[16px] py-4 px-6 font-semibold text-[15px] hover:bg-[#2d2d2d] transition-colors flex items-center justify-center gap-2">
    <MessageCircle className="size-5" />
    Connect Instantly
  </button>
</div>
```

**Booking Card:**

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6">
  <h3 className="text-[18px] font-semibold text-[#181818] mb-4">Book a Session</h3>
  <p className="text-[14px] text-[#767676] mb-6">
    Pick a time that works best for you and your schedule.
  </p>
  <button className="w-full bg-white border-2 border-[#181818] text-[#181818] rounded-[16px] py-4 px-6 font-semibold text-[15px] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2">
    <Calendar className="size-5" />
    Schedule Call
  </button>
  <p className="text-[12px] text-[#a2a2a2] text-center mt-4">
    SECURE CHECKOUT VIA EXPERTMARKET
  </p>
</div>
```

**Action Buttons:**

```tsx
<div className="flex gap-3">
  <button
    onClick={() => setIsSaved(!isSaved)}
    className="flex-1 bg-white border border-[#eee] text-[#181818] rounded-[16px] py-3 px-4 font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
  >
    <Heart className={`size-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
    {isSaved ? "Saved" : "Save"}
  </button>
  <button className="flex-1 bg-white border border-[#eee] text-[#181818] rounded-[16px] py-3 px-4 font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2">
    <Share2 className="size-4" />
    Share
  </button>
</div>
```

**Button Specs:**

**Primary Button (Connect Instantly):**
- Background: #181818
- Text: White
- Padding: 16px vertical, 24px horizontal
- Border radius: 16px
- Hover: #2d2d2d
- Icon: 20px

**Secondary Button (Schedule Call):**
- Background: White
- Border: 2px solid #181818
- Text: #181818
- Padding: 16px vertical, 24px horizontal
- Border radius: 16px
- Hover: #f5f5f5

**Tertiary Buttons (Save/Share):**
- Background: White
- Border: 1px solid #eee
- Text: #181818
- Padding: 12px vertical, 16px horizontal
- Icon: 16px

---

## Styling Guidelines

### Layout Grid System

```css
/* Main container */
max-width: 1400px
padding: 32px

/* 3-column layout on desktop */
grid-template-columns: 340px 1fr 340px
gap: 32px

/* Sticky positioning */
position: sticky
top: 32px
```

### Color Palette

```css
/* Backgrounds */
--page-bg: #f5f5f5
--card-bg: rgba(252, 252, 252, 0.95)
--card-border: #eeeeee

/* Text */
--text-primary: #181818
--text-secondary: #767676
--text-muted: #a2a2a2

/* Badges */
--badge-blue-bg: #e3f2fd
--badge-blue-text: #1976d2
--badge-green-bg: #e8f5e9
--badge-green-text: #2e7d32

/* Status */
--online-green: #22c55e
--verified-green: #30C935

/* Ratings */
--star-yellow: #facc15

/* Interactive */
--button-primary: #181818
--button-primary-hover: #2d2d2d
--button-border: #eee
--heart-red: #ef4444
```

### Typography Scale

```css
/* Headings */
--heading-1: 42px bold          /* Page title */
--heading-2: 28px bold          /* Section headings */
--heading-3: 24px bold          /* Profile name */
--heading-4: 20px semibold      /* Service titles */
--heading-5: 18px semibold      /* Subsections */

/* Body Text */
--body-large: 18px regular      /* Subheadings */
--body-default: 15px regular    /* Main content */
--body-small: 14px regular      /* Meta info */
--body-tiny: 13px regular       /* Badges, dates */
--body-caption: 12px regular    /* Labels */

/* Special */
--price: 24px bold
--stat-number: 20px bold
```

### Spacing System

```css
/* Card spacing */
--card-padding-large: 32px      /* Main content cards */
--card-padding-medium: 24px     /* Service cards */
--card-padding-small: 16px      /* Action cards */

/* Section spacing */
--section-gap: 24px
--item-gap: 16px
--tight-gap: 8px
--inline-gap: 4px

/* Component spacing */
--profile-image-size: 200px
--company-logo-size: 48px
--user-avatar-size: 48px
--icon-size-large: 20px
--icon-size-default: 16px
--icon-size-small: 14px
```

### Border Radius System

```css
--radius-xlarge: 40px           /* Profile card */
--radius-large: 32px            /* Profile image */
--radius-medium: 24px           /* Content cards */
--radius-default: 16px          /* Buttons */
--radius-small: 12px            /* Company logos */
--radius-full: 9999px           /* Badges, avatars */
```

### Shadow System

```css
/* Card shadow */
box-shadow: 
  0px 393px 110px 0px rgba(0,0,0,0),
  0px 252px 101px 0px rgba(0,0,0,0.01),
  0px 142px 85px 0px rgba(0,0,0,0.02),
  0px 63px 63px 0px rgba(0,0,0,0.04),
  0px 16px 35px 0px rgba(0,0,0,0.04);

/* Hover shadow (services) */
box-shadow: 
  0px 8px 24px 0px rgba(0,0,0,0.08);

/* Inner shadows (buttons) */
box-shadow: 
  inset 0px -2px 4px 0px rgba(137,137,137,0.08),
  inset 0px 1.5px 6px 0px white;
```

---

## Features & Interactions

### 1. Navigation

**Breadcrumb:**
- Displays: Home / Category / Provider Name
- Category taken from first interest
- "Home" button triggers `onBack()` callback
- Hover states on clickable items

### 2. Tab System

**Behavior:**
- Click to switch between tabs
- Active tab highlighted with black background
- Smooth transition animations
- State persists during session
- Default: "About" tab selected

**Tabs:**
- About: Biography and specializations
- Services: All offered services with pricing
- Reviews: Client testimonials
- Experience: Work history

### 3. Sticky Sidebars

**Left Sidebar:**
- Profile card sticks at 32px from top
- Scrolls with content on mobile
- Fixed width: 340px on desktop

**Right Sidebar:**
- Booking section sticks at 32px from top
- Always visible on desktop
- Moves below content on mobile

### 4. Availability Status

**Online Indicator:**
- Green dot (12px) when `isOnline === true`
- "Available Now" text
- Response time estimate
- Only shows for available providers

### 5. Booking Actions

**Connect Instantly:**
- Primary action for online providers
- Opens instant messaging
- Disabled if provider offline

**Schedule Call:**
- Opens calendar picker
- Shows available time slots
- Handles timezone conversion

**Security Notice:**
- "SECURE CHECKOUT VIA EXPERTMARKET"
- Builds trust
- 12px uppercase text

### 6. Social Actions

**Save Button:**
- Toggles saved/favorite status
- Heart icon fills red when saved
- State persists in provider data
- Visual feedback on click

**Share Button:**
- Opens share menu/modal
- Copy link functionality
- Social media sharing options

### 7. Verification Badge

**Display Logic:**
```typescript
{provider.kycStatus === "VERIFIED" && (
  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
    <VerificationIcon />
  </div>
)}
```

- Only shows for verified providers
- Positioned on profile image
- White background for contrast

### 8. Rating Display

**Star Rendering:**
```typescript
{[...Array(5)].map((_, i) => (
  <Star
    key={i}
    className={`size-5 ${
      i < Math.floor(provider.rating)
        ? "fill-yellow-400 text-yellow-400"
        : "text-gray-300"
    }`}
  />
))}
```

- 5 stars total
- Filled based on rating value
- Partial stars rounded down
- Yellow fill for filled stars

### 9. Service Cards

**Hover Effect:**
- Elevation increase on hover
- Shadow appears
- Smooth transition (300ms)
- No background color change

**Delivery Type Icons:**
- Video: Camera/video icon
- Written: Document/file icon
- Both: Message/chat icon
- Color: #767676

### 10. Review System

**Review Cards:**
- Chronological order (newest first)
- User avatar (48×48px)
- Individual star rating
- Formatted date ("2 days ago")
- Italic quote styling

**Load More:**
- Shows total review count
- Loads next batch (e.g., 10 at a time)
- Button becomes disabled when all loaded

---

## Integration with Marketplace

### Navigation Flow

1. **From Marketplace to Profile:**

```typescript
// In ProviderCard or ProviderListItem
<div onClick={() => onSelectProvider(provider.id)}>
  {/* Card content */}
</div>

// In App.tsx
const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

const handleSelectProvider = (id: string) => {
  const provider = providers.find(p => p.id === id);
  setSelectedProvider(provider || null);
};

// Conditional rendering
{selectedProvider ? (
  <ProfilePage 
    provider={selectedProvider} 
    onBack={() => setSelectedProvider(null)} 
  />
) : (
  <MarketplaceView />
)}
```

2. **From Profile to Marketplace:**

```typescript
// In ProfilePage breadcrumb
<button onClick={onBack}>Home</button>
```

### Shared Data Structure

Both marketplace and profile use the same `Provider` interface, ensuring consistency.

**Required fields for Profile Page:**
- All marketplace fields
- `sessions` (number)
- `experience` (number)
- `profile.timezone` (string)
- `profile.bio` (string, can be longer)
- `reviews` (Review[])
- `services[].deliveryType` ("video" | "written" | "both")

### State Synchronization

**Favorite/Save State:**
```typescript
// Update provider in main state when saved
const handleToggleSave = () => {
  setIsSaved(!isSaved);
  onUpdateProvider({
    ...provider,
    isFavorite: !isSaved
  });
};
```

This ensures favorite status persists when navigating back to marketplace.

---

## Responsive Behavior

### Breakpoints

```css
/* Mobile: < 1024px */
.profile-layout {
  grid-template-columns: 1fr;
}

/* Desktop: >= 1024px */
.profile-layout {
  grid-template-columns: 340px 1fr 340px;
  gap: 32px;
}
```

### Mobile Layout

**Stacking Order:**
1. Breadcrumb (full width)
2. Profile card (full width)
3. Tab navigation (full width)
4. Tab content (full width)
5. Booking sidebar (full width)

**Changes:**
- Remove sticky positioning
- Full width cards
- Larger touch targets (min 44px)
- Simplified spacing

### Tablet Layout (768px - 1024px)

**Stacking Order:**
1. Breadcrumb (full width)
2. Two-column layout:
   - Left: Profile card + Booking (sticky)
   - Right: Tabs + Content (scrollable)

---

## Advanced Customization

### Dynamic Breadcrumbs

```typescript
const breadcrumbs = [
  { label: "Home", onClick: () => navigate("/") },
  { label: provider.profile.interests[0] || "Services", onClick: () => navigate(`/category/${category}`) },
  { label: provider.name, active: true }
];
```

### Experience Timeline

For multiple work experiences:

```typescript
{provider.workHistory?.map((job) => (
  <div key={job.id} className="flex gap-4">
    <div className="shrink-0">
      {job.companyLogo ? (
        <img src={job.companyLogo} className="size-12 rounded-[12px]" />
      ) : (
        <div className="size-12 bg-[#efefef] rounded-[12px] flex items-center justify-center">
          {job.company[0]}
        </div>
      )}
    </div>
    <div>
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <p>{job.startDate} - {job.endDate || "Present"}</p>
      <p>{job.description}</p>
    </div>
  </div>
))}
```

### Portfolio/Gallery Tab

Add a 5th tab for work samples:

```typescript
{activeTab === "portfolio" && (
  <div className="grid grid-cols-2 gap-4">
    {provider.portfolio?.map((item) => (
      <div key={item.id} className="aspect-video rounded-[16px] overflow-hidden">
        <img src={item.thumbnail} className="w-full h-full object-cover" />
      </div>
    ))}
  </div>
)}
```

### Real-time Availability

```typescript
useEffect(() => {
  const ws = new WebSocket(`wss://api.example.com/providers/${provider.id}/status`);
  
  ws.onmessage = (event) => {
    const { isOnline } = JSON.parse(event.data);
    setProviderOnline(isOnline);
  };

  return () => ws.close();
}, [provider.id]);
```

### Booking Calendar Integration

```typescript
import { Calendar } from '@/components/ui/calendar';

const [selectedDate, setSelectedDate] = useState<Date>();
const [availableSlots, setAvailableSlots] = useState([]);

const handleDateSelect = async (date: Date) => {
  const slots = await fetchAvailableSlots(provider.id, date);
  setAvailableSlots(slots);
};
```

---

## Performance Optimizations

### 1. Image Optimization

```typescript
<img 
  src={provider.image}
  loading="lazy"
  srcSet={`
    ${provider.image}?w=200 200w,
    ${provider.image}?w=400 400w
  `}
  sizes="200px"
/>
```

### 2. Memoization

```typescript
const reviewStats = useMemo(() => ({
  average: provider.rating,
  total: provider.reviewCount,
  distribution: calculateDistribution(provider.reviews)
}), [provider.reviews]);
```

### 3. Lazy Loading Tabs

```typescript
const AboutTab = lazy(() => import('./tabs/AboutTab'));
const ServicesTab = lazy(() => import('./tabs/ServicesTab'));

<Suspense fallback={<Spinner />}>
  {activeTab === "about" && <AboutTab provider={provider} />}
</Suspense>
```

### 4. Virtual Scrolling for Reviews

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const parentRef = useRef(null);

const virtualizer = useVirtualizer({
  count: provider.reviews.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 150,
});
```

---

## Accessibility

### ARIA Labels

```tsx
<button 
  aria-label={`${isSaved ? 'Remove' : 'Save'} ${provider.name} to favorites`}
  onClick={handleToggleSave}
>
  <Heart />
</button>
```

### Keyboard Navigation

```tsx
<div 
  role="tablist" 
  aria-label="Profile sections"
>
  {tabs.map((tab) => (
    <button
      key={tab.id}
      role="tab"
      aria-selected={activeTab === tab.id}
      aria-controls={`${tab.id}-panel`}
      id={`${tab.id}-tab`}
    >
      {tab.label}
    </button>
  ))}
</div>

<div
  role="tabpanel"
  id={`${activeTab}-panel`}
  aria-labelledby={`${activeTab}-tab`}
>
  {/* Tab content */}
</div>
```

### Focus Management

```tsx
const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

const handleKeyDown = (e: KeyboardEvent, index: number) => {
  if (e.key === 'ArrowRight') {
    const nextIndex = (index + 1) % tabs.length;
    tabRefs.current[nextIndex]?.focus();
  } else if (e.key === 'ArrowLeft') {
    const prevIndex = (index - 1 + tabs.length) % tabs.length;
    tabRefs.current[prevIndex]?.focus();
  }
};
```

### Screen Reader Announcements

```tsx
<div role="status" aria-live="polite" className="sr-only">
  {isSaved ? `${provider.name} saved to favorites` : ''}
</div>
```

---

## Testing Recommendations

### Unit Tests

```typescript
describe('ProfilePage', () => {
  it('renders provider information correctly', () => {
    render(<ProfilePage provider={mockProvider} />);
    expect(screen.getByText(mockProvider.name)).toBeInTheDocument();
  });

  it('switches tabs on click', () => {
    render(<ProfilePage provider={mockProvider} />);
    fireEvent.click(screen.getByText('Services'));
    expect(screen.getByText('Services Offered')).toBeInTheDocument();
  });

  it('toggles save state', () => {
    render(<ProfilePage provider={mockProvider} />);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
describe('Profile Navigation', () => {
  it('navigates back to marketplace on breadcrumb click', () => {
    const onBack = jest.fn();
    render(<ProfilePage provider={mockProvider} onBack={onBack} />);
    fireEvent.click(screen.getByText('Home'));
    expect(onBack).toHaveBeenCalled();
  });
});
```

### Visual Tests

```typescript
import { test, expect } from '@playwright/test';

test('profile page matches screenshot', async ({ page }) => {
  await page.goto('/profile/1');
  await expect(page).toHaveScreenshot('profile-page.png');
});
```

---

## Common Issues & Solutions

### Issue: Sticky sidebars overlap on scroll
**Solution:** Add proper top offset and z-index
```css
.sticky-sidebar {
  position: sticky;
  top: 32px;
  z-index: 10;
}
```

### Issue: Tab content doesn't update
**Solution:** Ensure proper conditional rendering
```tsx
{activeTab === "about" && <AboutContent />}
{activeTab === "services" && <ServicesContent />}
```

### Issue: Images don't load
**Solution:** Check image URLs and add error handling
```tsx
<img 
  src={provider.image} 
  onError={(e) => e.currentTarget.src = '/placeholder.png'} 
/>
```

### Issue: Breadcrumb category undefined
**Solution:** Provide fallback value
```tsx
{provider.profile.interests[0] || "Services"}
```

### Issue: Reviews not showing
**Solution:** Verify reviews array exists
```tsx
{provider.reviews?.length > 0 ? (
  <ReviewsList reviews={provider.reviews} />
) : (
  <NoReviewsMessage />
)}
```

---

## Next Steps & Enhancements

1. **Messaging System**: Real-time chat integration
2. **Booking Calendar**: Interactive availability calendar
3. **Video Consultation**: Embedded video call functionality
4. **Payment Integration**: Stripe/PayPal checkout
5. **Reviews Submission**: Allow clients to leave reviews
6. **Portfolio Gallery**: Image/video showcase tab
7. **Related Providers**: "You might also like" section
8. **Social Sharing**: Enhanced sharing with preview cards
9. **Download vCard**: Export contact information
10. **Report/Block**: Safety features

---

## Conclusion

This guide provides a complete blueprint for recreating the service provider profile page. The implementation focuses on:

- **Consistent Design**: Matching marketplace aesthetics
- **Responsive Layout**: Works on all devices
- **Rich Information**: Comprehensive provider details
- **Easy Navigation**: Smooth transitions and breadcrumbs
- **Clear Actions**: Prominent booking and save options
- **Professional Polish**: Attention to spacing, typography, and interactions

Follow the steps in order, paying attention to the exact dimensions, colors, and spacing to match the original design perfectly.

For questions or enhancements, refer to the component files and use this guide as your reference documentation.
