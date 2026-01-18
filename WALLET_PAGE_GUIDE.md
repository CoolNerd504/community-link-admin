# Wallet & Minutes Page - Complete Implementation Guide

## Overview

The Wallet & Minutes Page is a comprehensive interface for users to purchase, manage, and track their session minutes. Built following the ProSupport marketplace design language and structured around the `/api/minute-packages` and `/api/wallet/purchase` endpoints, it provides a clean package selection experience with payment integration and transaction history.

## Design Principles

- **API-Driven Design**: Built directly from MinutePackage and PurchaseMinutes interfaces
- **Value Communication**: Clear pricing, savings, and per-minute costs
- **Payment Flexibility**: Multiple payment methods (Mobile Money, Credit Card)
- **Transaction Transparency**: Complete purchase and usage history
- **Conversion Optimization**: Recommended badges, special offers, social proof
- **Consistent Design Language**: Matches all other ProSupport components
- **Smart Layout**: 3/4 + 1/4 grid with sticky sidebar for always-visible guidance

---

## API Payload Structure

### Get Minute Packages

**Endpoint**: `GET /api/minute-packages`

```typescript
type MinutePackageResponse = MinutePackage[];

interface MinutePackage {
  id: string;          // e.g., "pkg_30"
  name: string;        // e.g., "Starter"
  minutes: number;     // Amount of minutes included
  price: number;       // Price in base currency (ZMW)
  description?: string; // Optional marketing text
}
```

**Example Response**:
```json
[
  {
    "id": "pkg_30",
    "name": "Starter",
    "minutes": 30,
    "price": 450,
    "description": "Perfect for trying out"
  },
  {
    "id": "pkg_60",
    "name": "Basic",
    "minutes": 60,
    "price": 850,
    "description": "Most popular choice"
  }
]
```

### Purchase Minutes

**Endpoint**: `POST /api/wallet/purchase`

**Request Body**:
```typescript
interface PurchaseMinutesRequest {
  packageId: string;           // ID of the package from the GET list
  paymentMethod?: string;      // Default: "MOBILE_MONEY". Optional.
}
```

**Success Response (201 Created)**:
```typescript
interface MinutePurchaseResponse {
  id: string;
  walletId: string;
  packageName: string;
  minutesPurchased: number;
  priceZMW: number;
  paymentMethod: string;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  transactionRef: string;
  createdAt: string; // ISO Date
}
```

**Example Response**:
```json
{
  "id": "purchase_123",
  "walletId": "wallet_456",
  "packageName": "Professional",
  "minutesPurchased": 120,
  "priceZMW": 1600,
  "paymentMethod": "MOBILE_MONEY",
  "paymentStatus": "COMPLETED",
  "transactionRef": "TXN-2024-001",
  "createdAt": "2024-01-18T10:30:00Z"
}
```

---

## Layout Structure

### Grid System

```
Desktop (lg+):
┌────────────────────────────────────────────────────────────┐
│  Header (Sticky top-0, z-10)                               │
│  [Title + View History Button]                             │
├─────────────────────────────────────────┬──────────────────┤
│  Left Column (3/4 width - Scrollable)   │  Right (1/4)     │
│                                          │                  │
│  ┌────────────────────────────────────┐ │  ┌────────────┐ │
│  │ Balance Card (Blue Gradient)       │ │  │ How It     │ │
│  │ • Available Minutes (180)          │ │  │ Works      │ │
│  │ • 3 Stats Cards                    │ │  │            │ │
│  │ ┌────────────────────────────────┐ │ │  │ Sticky!    │ │
│  │ │ Special Offer (Integrated)     │ │ │  │ top-120px  │ │
│  │ │ Gift Icon + Promo + Apply      │ │ │  │            │ │
│  │ └────────────────────────────────┘ │ │  │ 1. Choose  │ │
│  └────────────────────────────────────┘ │  │ 2. Pay     │ │
│                                          │  │ 3. Book    │ │
│  ┌────────────────────────────────────┐ │  └────────────┘ │
│  │ Tabs [Buy Minutes | History]       │ │                  │
│  └────────────────────────────────────┘ │  ┌────────────┐ │
│                                          │  │ Need Help? │ │
│  ┌──────────────┬──────────────┐        │  │            │ │
│  │  Package 1   │  Package 2   │        │  │ Sticky!    │ │
│  │  (2 cols)    │              │        │  │            │ │
│  └──────────────┴──────────────┘        │  │ Contact    │ │
│  ┌──────────────┬──────────────┐        │  │ Support    │ │
│  │  Package 3   │  Package 4   │        │  └────────────┘ │
│  └──────────────┴──────────────┘        │                  │
│                                          │                  │
│  (Payment Methods if package selected)  │                  │
│  (Or Transaction History if on that tab)│                  │
└─────────────────────────────────────────┴──────────────────┘

Mobile (< 1024px):
┌─────────────────┐
│ Header          │
├─────────────────┤
│ Balance Card    │
│ + Special Offer │
├─────────────────┤
│ How It Works    │
├─────────────────┤
│ Need Help?      │
├─────────────────┤
│ Tabs            │
├─────────────────┤
│ Package 1       │
│ Package 2       │
│ Package 3       │
│ (1 column)      │
└─────────────────┘
```

### Container
- Max width: 1400px
- Padding: 32px (px-8 py-8)
- Background: #f5f5f5

### Grid Configuration
```tsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  <div className="lg:col-span-3">
    {/* Left column - 75% width on desktop */}
  </div>
  <div className="lg:col-span-1">
    {/* Right column - 25% width on desktop */}
    <div className="sticky top-[120px] space-y-6">
      {/* Both cards sticky together */}
    </div>
  </div>
</div>
```

---

## Component Structure

### File Location
```
/src/app/components/wallet-page.tsx
```

### TypeScript Interfaces

```typescript
// From API
interface MinutePackage {
  id: string;
  name: string;
  minutes: number;
  price: number;
  description?: string;
}

interface PurchaseMinutesRequest {
  packageId: string;
  paymentMethod?: string;
}

interface MinutePurchaseResponse {
  id: string;
  walletId: string;
  packageName: string;
  minutesPurchased: number;
  priceZMW: number;
  paymentMethod: string;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  transactionRef: string;
  createdAt: string;
}

// Component-specific
interface WalletStats {
  availableMinutes: number;
  totalPurchased: number;
  totalSpent: number;
  avgSessionLength: number;
}

interface Transaction {
  id: string;
  type: "purchase" | "usage";
  packageName?: string;
  minutes: number;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  date: string;
  transactionRef?: string;
}

interface WalletPageProps {
  onPurchase?: (purchase: PurchaseMinutesRequest) => void;
}
```

---

## Section 1: Header (Sticky)

**Position**: Sticky at top (z-index: 10)
**Background**: White with bottom border
**Height**: ~89px (with padding)

```tsx
<div className="bg-white border-b border-[#eee] sticky top-0 z-10">
  <div className="max-w-[1400px] mx-auto px-8 py-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-[28px] font-bold text-[#181818] mb-1">
          Wallet & Minutes
        </h1>
        <p className="text-[15px] text-[#767676]">
          Manage your session minutes and top-up packages
        </p>
      </div>
      <button 
        onClick={() => setActiveTab("history")}
        className="flex items-center gap-2 px-4 h-[44px] border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors"
      >
        <History className="size-4" />
        View History
      </button>
    </div>
  </div>
</div>
```

**Elements**:
- Title: "Wallet & Minutes" (28px, bold, #181818)
- Subtitle: Descriptive text (15px, #767676)
- "View History" button: Switches to history tab

---

## Section 2: Balance Card with Integrated Special Offer

**Location**: Left column, top
**Background**: Gradient from #2563eb to #1d4ed8
**Shadow**: `0px_16px_35px_0px_rgba(37,99,235,0.3)`
**Margin Bottom**: 32px (mb-8)
**Padding**: 32px (p-8)

### Full Card Structure

```tsx
<div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-[24px] p-8 mb-8 shadow-[0px_16px_35px_0px_rgba(37,99,235,0.3)]">
  {/* Top Section - Available Minutes */}
  <div className="flex items-start justify-between mb-6">
    <div>
      <p className="text-[14px] text-white/80 mb-2">Available Minutes</p>
      <p className="text-[48px] font-bold text-white leading-none mb-2">
        {stats.availableMinutes}
      </p>
      <p className="text-[14px] text-white/80">
        ≈ {Math.floor(stats.availableMinutes / 60)} hours {stats.availableMinutes % 60} minutes
      </p>
    </div>
    <div className="size-16 bg-white/20 rounded-[16px] flex items-center justify-center">
      <Clock className="size-8 text-white" />
    </div>
  </div>

  {/* Stats Grid */}
  <div className="grid grid-cols-3 gap-4 mb-6">
    <div className="bg-white/10 rounded-[16px] p-4 backdrop-blur-sm">
      <p className="text-[12px] text-white/80 mb-1">TOTAL PURCHASED</p>
      <p className="text-[20px] font-bold text-white">{stats.totalPurchased}</p>
    </div>
    <div className="bg-white/10 rounded-[16px] p-4 backdrop-blur-sm">
      <p className="text-[12px] text-white/80 mb-1">TOTAL SPENT</p>
      <p className="text-[20px] font-bold text-white">ZMW {stats.totalSpent.toLocaleString()}</p>
    </div>
    <div className="bg-white/10 rounded-[16px] p-4 backdrop-blur-sm">
      <p className="text-[12px] text-white/80 mb-1">AVG SESSION</p>
      <p className="text-[20px] font-bold text-white">{stats.avgSessionLength} min</p>
    </div>
  </div>

  {/* Special Offer - Integrated */}
  <div className="bg-white/15 backdrop-blur-sm rounded-[20px] p-5 border border-white/20">
    <div className="flex items-center justify-between gap-6">
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3 flex-1">
        <div className="size-10 bg-[#9333ea] rounded-[12px] flex items-center justify-center flex-shrink-0">
          <Gift className="size-5 text-white" />
        </div>
        <div>
          <p className="text-[18px] font-bold text-white mb-1">
            Get 10% Bonus Minutes
          </p>
          <p className="text-[13px] text-white/80">
            Purchase 300+ minutes and receive extra 10% bonus!
          </p>
        </div>
      </div>
      
      {/* Right: Promo Code + Button */}
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-[12px] px-4 py-2.5 backdrop-blur-sm border border-white/30">
          <p className="text-[10px] text-white/80 mb-0.5 tracking-wide">PROMO CODE</p>
          <p className="text-[16px] font-mono font-bold text-white">WELCOME10</p>
        </div>
        <button className="bg-white text-[#2563eb] rounded-[12px] px-5 py-2.5 font-semibold text-[14px] hover:bg-white/90 transition-colors whitespace-nowrap">
          Apply
        </button>
      </div>
    </div>
  </div>
</div>
```

### Available Minutes Display

**Main Number**:
- Font size: 48px
- Font weight: Bold
- Color: White
- Line height: None (tight)

**Label Above**:
- "Available Minutes"
- 14px, white/80 opacity

**Conversion Below**:
- Hour/minute breakdown
- 14px, white/80 opacity

**Clock Icon**:
- Container: 64px × 64px
- Background: white/20
- Border radius: 16px
- Icon: 32px, white

### Stats Cards (3 columns)

**Grid**: 3 equal columns, 16px gap (gap-4)

**Card Style**:
- Background: white/10
- Backdrop blur: sm
- Border radius: 16px
- Padding: 16px

**Each Card**:
1. **Label** (top)
   - 12px, uppercase
   - white/80 opacity
   - 4px margin bottom

2. **Value** (bottom)
   - 20px, bold
   - White color

**Stats Displayed**:
- TOTAL PURCHASED: Total minutes ever bought
- TOTAL SPENT: Total ZMW spent
- AVG SESSION: Average session length

### Special Offer Section (Integrated)

**Container Style**:
- Background: white/15
- Backdrop blur: sm
- Border radius: 20px
- Padding: 20px (p-5)
- Border: white/20

**Layout**: Horizontal flex with space-between

**Left Side**:
1. **Purple Gift Icon**
   - Container: 40px × 40px
   - Background: #9333ea
   - Border radius: 12px
   - Icon: 20px, white

2. **Text Block**
   - Title: "Get 10% Bonus Minutes" (18px, bold, white)
   - Description: Purchase text (13px, white/80)

**Right Side**:
1. **Promo Code Box**
   - Background: white/20
   - Border: white/30
   - Rounded: 12px
   - Padding: px-4 py-2.5
   - Label: "PROMO CODE" (10px, white/80, tracking-wide)
   - Code: "WELCOME10" (16px, mono, bold, white)

2. **Apply Button**
   - Background: White
   - Text: #2563eb (blue)
   - Rounded: 12px
   - Padding: px-5 py-2.5
   - Font: 14px, semibold
   - Hover: bg-white/90

---

## Section 3: Tab Navigation

**Location**: Left column, below balance card
**Margin Bottom**: 24px (mb-6)

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-2 mb-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex gap-2">
    <button
      onClick={() => setActiveTab("packages")}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-[14px] font-semibold transition-all ${
        activeTab === "packages"
          ? "bg-[#2563eb] text-white shadow-md"
          : "text-[#767676] hover:bg-[#f5f5f5] hover:text-[#181818]"
      }`}
    >
      <Plus className="size-4" />
      Buy Minutes
    </button>
    <button
      onClick={() => setActiveTab("history")}
      className={/* Same structure */}
    >
      <History className="size-4" />
      Transaction History
    </button>
  </div>
</div>
```

**Two Tabs**:
1. **Buy Minutes** (Plus icon)
   - Shows package selection and payment
2. **Transaction History** (History icon)
   - Shows all purchases and usage

**Active State**:
- Background: #2563eb
- Text: White
- Shadow: md

**Inactive State**:
- Text: #767676
- Hover background: #f5f5f5
- Hover text: #181818

---

## Section 4: Buy Minutes Tab

### 4.1 Package Grid

**Layout**: 2-column grid on desktop (1 column on mobile)
**Gap**: 24px (gap-6)
**Location**: Left column content area

```tsx
<div className="space-y-6">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-[20px] font-bold text-[#181818] mb-1">
        Choose Your Package
      </h2>
      <p className="text-[14px] text-[#767676]">
        Select a minute package that fits your needs
      </p>
    </div>
  </div>

  {/* Package Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {packages.map((pkg) => {
      const isSelected = selectedPackage === pkg.id;
      const isRecommended = pkg.id === "pkg_120"; // Professional
      const badgeColor = getBadgeColor(pkg.name);

      return (
        <div
          key={pkg.id}
          onClick={() => setSelectedPackage(pkg.id)}
          className={`relative backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border-2 p-6 cursor-pointer transition-all ${
            isSelected
              ? "border-[#2563eb] shadow-[0px_20px_40px_0px_rgba(37,99,235,0.15)]"
              : "border-[#eee] hover:border-[#2563eb] hover:shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]"
          }`}
        >
          {/* Package content */}
        </div>
      );
    })}
  </div>
</div>
```

### 4.2 Package Card Structure

**Card Container**:
- Background: rgba(252,252,252,0.95)
- Backdrop blur: 16px
- Border radius: 24px
- Border: 2px
- Padding: 24px
- Cursor: pointer
- Transition: all

**Selected State**:
- Border: #2563eb
- Shadow: `0px_20px_40px_0px_rgba(37,99,235,0.15)`

**Hover State**:
- Border: #2563eb
- Shadow: `0px_16px_35px_0px_rgba(0,0,0,0.04)`

### Package Card Elements

```tsx
{/* 1. Recommended Badge (Conditional) */}
{isRecommended && (
  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
    <span className="px-4 py-1 bg-[#f59e0b] text-white rounded-full text-[11px] font-bold tracking-wide shadow-lg">
      MOST POPULAR
    </span>
  </div>
)}

{/* 2. Selection Indicator (Conditional) */}
{isSelected && (
  <div className="absolute top-4 right-4">
    <div className="size-6 bg-[#2563eb] rounded-full flex items-center justify-center">
      <Check className="size-4 text-white" />
    </div>
  </div>
)}

{/* 3. Package Badge */}
<div className="mb-4">
  <span
    className="px-3 py-1 rounded-full text-[12px] font-bold"
    style={{
      backgroundColor: badgeColor.bg,
      color: badgeColor.text
    }}
  >
    {pkg.name}
  </span>
</div>

{/* 4. Minutes Display */}
<div className="mb-3">
  <p className="text-[40px] font-bold text-[#181818] leading-none">
    {pkg.minutes}
  </p>
  <p className="text-[14px] text-[#767676] mt-1">MINUTES</p>
</div>

{/* 5. Description */}
{pkg.description && (
  <p className="text-[13px] text-[#767676] mb-4">{pkg.description}</p>
)}

{/* 6. Price */}
<div className="flex items-baseline gap-2 mb-4">
  <p className="text-[28px] font-bold text-[#181818]">
    ZMW {pkg.price}
  </p>
  <p className="text-[14px] text-[#767676]">
    ({(pkg.price / pkg.minutes).toFixed(1)} per min)
  </p>
</div>

{/* 7. Features List */}
<div className="space-y-2 pt-4 border-t border-[#eee]">
  <div className="flex items-center gap-2 text-[13px] text-[#767676]">
    <Check className="size-4 text-[#16a34a]" />
    <span>Valid for 12 months</span>
  </div>
  <div className="flex items-center gap-2 text-[13px] text-[#767676]">
    <Check className="size-4 text-[#16a34a]" />
    <span>Use anytime, any provider</span>
  </div>
  <div className="flex items-center gap-2 text-[13px] text-[#767676]">
    <Check className="size-4 text-[#16a34a]" />
    <span>Instant activation</span>
  </div>
</div>
```

### Package Badge Colors

```typescript
const getBadgeColor = (packageName: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    "Starter": { bg: "#dbeafe", text: "#2563eb" },      // Blue
    "Basic": { bg: "#f3e8ff", text: "#9333ea" },        // Purple
    "Professional": { bg: "#dcfce7", text: "#16a34a" }, // Green
    "Premium": { bg: "#fef3c7", text: "#f59e0b" },      // Orange
    "Enterprise": { bg: "#fee2e2", text: "#ef4444" }    // Red
  };
  return colors[packageName] || { bg: "#f5f5f5", text: "#767676" };
};
```

### Recommended Badge Logic

```typescript
const getRecommendedBadge = (packageId: string) => {
  return packageId === "pkg_120"; // Professional package is most popular
};
```

### Default Packages

```typescript
const packages: MinutePackage[] = [
  {
    id: "pkg_30",
    name: "Starter",
    minutes: 30,
    price: 450,
    description: "Perfect for trying out"
  },
  {
    id: "pkg_60",
    name: "Basic",
    minutes: 60,
    price: 850,
    description: "Most popular choice"
  },
  {
    id: "pkg_120",
    name: "Professional",
    minutes: 120,
    price: 1600,
    description: "Best value - Save 5%"
  },
  {
    id: "pkg_300",
    name: "Premium",
    minutes: 300,
    price: 3800,
    description: "For power users - Save 10%"
  },
  {
    id: "pkg_600",
    name: "Enterprise",
    minutes: 600,
    price: 7200,
    description: "Ultimate package - Save 15%"
  }
];
```

### 4.3 Payment Method Selection

**Visibility**: Only shown when a package is selected
**Location**: Below package grid

```tsx
{selectedPackage && (
  <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
    <h3 className="text-[18px] font-semibold text-[#181818] mb-4">
      Select Payment Method
    </h3>
    
    {/* Payment Method Buttons */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Mobile Money */}
      <button
        onClick={() => setSelectedPaymentMethod("MOBILE_MONEY")}
        className={`flex items-center gap-3 p-4 rounded-[16px] border-2 transition-all ${
          selectedPaymentMethod === "MOBILE_MONEY"
            ? "border-[#2563eb] bg-[#f0f4ff]"
            : "border-[#eee] hover:border-[#2563eb]"
        }`}
      >
        <Smartphone className="size-6 text-[#2563eb]" />
        <div className="text-left">
          <p className="text-[14px] font-semibold text-[#181818]">Mobile Money</p>
          <p className="text-[12px] text-[#767676]">MTN, Airtel, Zamtel</p>
        </div>
        {selectedPaymentMethod === "MOBILE_MONEY" && (
          <Check className="size-5 text-[#2563eb] ml-auto" />
        )}
      </button>

      {/* Credit Card */}
      <button
        onClick={() => setSelectedPaymentMethod("CREDIT_CARD")}
        className={/* Same structure */}
      >
        <CreditCard className="size-6 text-[#2563eb]" />
        <div className="text-left">
          <p className="text-[14px] font-semibold text-[#181818]">Credit Card</p>
          <p className="text-[12px] text-[#767676]">Visa, Mastercard</p>
        </div>
        {selectedPaymentMethod === "CREDIT_CARD" && (
          <Check className="size-5 text-[#2563eb] ml-auto" />
        )}
      </button>
    </div>

    {/* Purchase Summary */}
    <div className="bg-[#f5f5f5] rounded-[16px] p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] text-[#767676]">Package:</span>
        <span className="text-[14px] font-semibold text-[#181818]">
          {packages.find(p => p.id === selectedPackage)?.name}
        </span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] text-[#767676]">Minutes:</span>
        <span className="text-[14px] font-semibold text-[#181818]">
          {packages.find(p => p.id === selectedPackage)?.minutes}
        </span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#eee]">
        <span className="text-[16px] font-semibold text-[#181818]">Total:</span>
        <span className="text-[20px] font-bold text-[#181818]">
          ZMW {packages.find(p => p.id === selectedPackage)?.price}
        </span>
      </div>
    </div>

    {/* Complete Purchase Button */}
    <button
      onClick={handlePurchase}
      className="w-full bg-[#2563eb] text-white rounded-[12px] py-4 font-semibold text-[16px] hover:bg-[#1d4ed8] transition-colors flex items-center justify-center gap-2"
    >
      <Check className="size-5" />
      Complete Purchase
    </button>
  </div>
)}
```

**Payment Methods**:
1. **Mobile Money** (default)
   - MTN, Airtel, Zamtel
   - Smartphone icon

2. **Credit Card**
   - Visa, Mastercard
   - CreditCard icon

**Selected State**:
- Border: #2563eb
- Background: #f0f4ff
- Checkmark shown

---

## Section 5: Transaction History Tab

**Visibility**: When `activeTab === "history"`

```tsx
<div className="space-y-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-[20px] font-bold text-[#181818] mb-1">
        Transaction History
      </h2>
      <p className="text-[14px] text-[#767676]">
        All your minute purchases and usage
      </p>
    </div>
    <button className="flex items-center gap-2 px-4 py-2 border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[13px] hover:bg-[#f5f5f5] transition-colors">
      <Download className="size-4" />
      Export
    </button>
  </div>

  {/* Transactions List */}
  <div className="space-y-3">
    {transactions.map((transaction) => (
      <div key={transaction.id} className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-5 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] transition-shadow">
        <div className="flex items-center justify-between">
          {/* Left: Icon + Info */}
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className={`size-12 rounded-[12px] flex items-center justify-center ${
              transaction.type === "purchase" 
                ? "bg-[#dcfce7]" 
                : "bg-[#fee2e2]"
            }`}>
              {transaction.type === "purchase" ? (
                <TrendingUp className="size-6 text-[#16a34a]" />
              ) : (
                <ArrowUpRight className="size-6 text-[#ef4444]" />
              )}
            </div>

            {/* Transaction Info */}
            <div>
              <p className="text-[15px] font-semibold text-[#181818] mb-1">
                {transaction.type === "purchase" 
                  ? `Purchase - ${transaction.packageName}` 
                  : "Session Usage"}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-[13px] text-[#767676]">
                  {formatDate(transaction.date)}
                </p>
                {transaction.transactionRef && (
                  <>
                    <span className="text-[#767676]">•</span>
                    <p className="text-[13px] text-[#767676] font-mono">
                      {transaction.transactionRef}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Amount & Status */}
          <div className="text-right">
            <p className={`text-[18px] font-bold mb-1 ${
              transaction.type === "purchase" 
                ? "text-[#16a34a]" 
                : "text-[#ef4444]"
            }`}>
              {transaction.type === "purchase" ? "+" : ""}{transaction.minutes} min
            </p>
            {transaction.amount > 0 && (
              <p className="text-[13px] text-[#767676] mb-1">
                ZMW {transaction.amount}
              </p>
            )}
            <span className={`inline-block px-2 py-1 rounded-full text-[11px] font-semibold ${
              transaction.status === "COMPLETED" 
                ? "bg-[#dcfce7] text-[#16a34a]" 
                : transaction.status === "PENDING"
                ? "bg-[#fef3c7] text-[#f59e0b]"
                : "bg-[#fee2e2] text-[#ef4444]"
            }`}>
              {transaction.status}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

### Transaction Card Structure

**Container**:
- Backdrop blur: 16px
- Background: rgba(252,252,252,0.95)
- Border radius: 24px
- Padding: 20px (p-5)
- Hover shadow increases

**Transaction Types**:

1. **Purchase**
   - Icon: TrendingUp (green background)
   - Title: "Purchase - {packageName}"
   - Minutes: Positive (green, with +)
   - Amount shown

2. **Usage**
   - Icon: ArrowUpRight (red background)
   - Title: "Session Usage"
   - Minutes: Negative (red, no +)
   - No amount shown

**Status Colors**:
- COMPLETED: Green (#dcfce7 bg, #16a34a text)
- PENDING: Orange (#fef3c7 bg, #f59e0b text)
- FAILED: Red (#fee2e2 bg, #ef4444 text)

**Date Formatting**:
```typescript
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

---

## Section 6: Right Sidebar (Sticky)

**Layout**: 1/4 width on desktop (lg:col-span-1)
**Sticky Position**: Both cards together
**Top Offset**: 120px
**Gap**: 24px (space-y-6)

### Container Structure

```tsx
<div className="lg:col-span-1">
  <div className="sticky top-[120px] space-y-6">
    {/* How It Works Card */}
    {/* Need Help? Card */}
  </div>
</div>
```

### 6.1 How It Works Card

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-2 mb-4">
    <Info className="size-5 text-[#2563eb]" />
    <h3 className="text-[18px] font-semibold text-[#181818]">How It Works</h3>
  </div>
  
  <div className="space-y-4">
    {/* Step 1 */}
    <div className="flex gap-3">
      <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-[14px] font-bold text-[#2563eb]">1</span>
      </div>
      <div>
        <p className="text-[15px] text-[#181818] font-semibold mb-1">
          Choose Package
        </p>
        <p className="text-[13px] text-[#767676]">
          Select the minutes you need
        </p>
      </div>
    </div>

    {/* Step 2 */}
    <div className="flex gap-3">
      <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-[14px] font-bold text-[#2563eb]">2</span>
      </div>
      <div>
        <p className="text-[15px] text-[#181818] font-semibold mb-1">
          Complete Payment
        </p>
        <p className="text-[13px] text-[#767676]">
          Pay via mobile money or card
        </p>
      </div>
    </div>

    {/* Step 3 */}
    <div className="flex gap-3">
      <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-[14px] font-bold text-[#2563eb]">3</span>
      </div>
      <div>
        <p className="text-[15px] text-[#181818] font-semibold mb-1">
          Start Booking
        </p>
        <p className="text-[13px] text-[#767676]">
          Minutes added instantly
        </p>
      </div>
    </div>
  </div>
</div>
```

**Structure**:
- Title with Info icon (18px, semibold)
- 3 steps in vertical layout (space-y-4)
- Each step:
  - Numbered circle (32px, #f0f4ff bg, #2563eb text)
  - Title (15px, semibold, #181818)
  - Description (13px, #767676)

### 6.2 Need Help? Card

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-2 mb-3">
    <AlertCircle className="size-5 text-[#767676]" />
    <h3 className="text-[16px] font-semibold text-[#181818]">Need Help?</h3>
  </div>
  
  <p className="text-[13px] text-[#767676] mb-4">
    Have questions about minutes or payments? Our support team is here to help.
  </p>
  
  <button className="w-full flex items-center justify-center gap-2 py-2 border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors">
    Contact Support
    <ChevronRight className="size-4" />
  </button>
</div>
```

**Structure**:
- Title with AlertCircle icon (16px, semibold)
- Description text (13px, #767676)
- Full-width button with ChevronRight icon
- Border style (not filled)

---

## Section 7: Purchase Success Modal

**Trigger**: After successful purchase (`showPurchaseModal === true`)
**Position**: Fixed, centered on screen
**Z-index**: 50

```tsx
{showPurchaseModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.98)] rounded-[24px] border border-[#eee] p-8 max-w-md w-full shadow-[0px_20px_60px_0px_rgba(0,0,0,0.3)]">
      <div className="text-center">
        {/* Success Icon */}
        <div className="size-16 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="size-8 text-[#16a34a]" />
        </div>
        
        {/* Title */}
        <h3 className="text-[24px] font-bold text-[#181818] mb-2">
          Purchase Successful!
        </h3>
        
        {/* Message */}
        <p className="text-[15px] text-[#767676] mb-6">
          Your minutes have been added to your account and are ready to use.
        </p>
        
        {/* Minutes Display */}
        <div className="bg-[#f5f5f5] rounded-[16px] p-4 mb-6">
          <p className="text-[14px] text-[#767676] mb-1">Minutes Added</p>
          <p className="text-[32px] font-bold text-[#181818]">
            {packages.find(p => p.id === selectedPackage)?.minutes}
          </p>
        </div>
        
        {/* Continue Button */}
        <button
          onClick={() => setShowPurchaseModal(false)}
          className="w-full bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
)}
```

**Elements**:
1. **Backdrop**: Black/50 with blur
2. **Modal Container**: Centered, max-width 448px
3. **Success Icon**: Green circle with checkmark
4. **Title**: "Purchase Successful!" (24px, bold)
5. **Message**: Confirmation text (15px)
6. **Minutes Display**: Gray box showing added minutes (32px, bold)
7. **Continue Button**: Blue, full width

---

## Icons Used (lucide-react)

```javascript
import {
  Wallet,         // Future use
  Clock,          // Available minutes
  TrendingUp,     // Purchase transaction
  Plus,           // Buy minutes tab
  CreditCard,     // Credit card payment
  Smartphone,     // Mobile money payment
  Check,          // Selection, success, features
  X,              // Future use (close)
  History,        // Transaction history
  Download,       // Export transactions
  ArrowUpRight,   // Usage transaction
  DollarSign,     // Future use
  Zap,            // Future use
  Gift,           // Special offer icon
  Award,          // Future use
  ChevronRight,   // Contact support arrow
  Info,           // How it works
  AlertCircle     // Need help icon
} from "lucide-react";
```

---

## Color System

### Primary Colors
```css
--primary-text: #181818;
--secondary-text: #767676;
--background: #f5f5f5;
--border: #eeeeee;
--accent-blue: #2563eb;
--accent-blue-dark: #1d4ed8;
```

### Package Badge Colors

```typescript
const badgeColors = {
  "Starter": {
    bg: "#dbeafe",    // Light blue
    text: "#2563eb"   // Blue
  },
  "Basic": {
    bg: "#f3e8ff",    // Light purple
    text: "#9333ea"   // Purple
  },
  "Professional": {
    bg: "#dcfce7",    // Light green
    text: "#16a34a"   // Green
  },
  "Premium": {
    bg: "#fef3c7",    // Light orange
    text: "#f59e0b"   // Orange
  },
  "Enterprise": {
    bg: "#fee2e2",    // Light red
    text: "#ef4444"   // Red
  }
};
```

### Transaction Status Colors

```css
/* Completed */
--completed-bg: #dcfce7;
--completed-text: #16a34a;

/* Pending */
--pending-bg: #fef3c7;
--pending-text: #f59e0b;

/* Failed */
--failed-bg: #fee2e2;
--failed-text: #ef4444;
```

### Transaction Type Colors

```css
/* Purchase (Positive) */
--purchase-bg: #dcfce7;      // Light green
--purchase-icon: #16a34a;    // Green

/* Usage (Negative) */
--usage-bg: #fee2e2;         // Light red
--usage-icon: #ef4444;       // Red
```

### Gradient Cards

```css
/* Balance Card */
background: linear-gradient(to bottom right, #2563eb, #1d4ed8);
box-shadow: 0px 16px 35px 0px rgba(37, 99, 235, 0.3);

/* Special Offer Icon */
background: #9333ea; /* Purple */
```

### Card Shadows

```css
/* Default Card */
box-shadow: 0px 16px 35px 0px rgba(0, 0, 0, 0.04);

/* Selected Package */
box-shadow: 0px 20px 40px 0px rgba(37, 99, 235, 0.15);

/* Balance Card */
box-shadow: 0px 16px 35px 0px rgba(37, 99, 235, 0.3);

/* Modal */
box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.3);
```

---

## State Management

### React State

```typescript
const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"MOBILE_MONEY" | "CREDIT_CARD">("MOBILE_MONEY");
const [showPurchaseModal, setShowPurchaseModal] = useState(false);
const [activeTab, setActiveTab] = useState<"packages" | "history">("packages");
```

### Props

```typescript
interface WalletPageProps {
  onPurchase?: (purchase: PurchaseMinutesRequest) => void;
}
```

**onPurchase Callback**:
Called when user completes purchase with:
```typescript
{
  packageId: string;      // e.g., "pkg_120"
  paymentMethod: string;  // "MOBILE_MONEY" or "CREDIT_CARD"
}
```

---

## API Integration

### Fetch Minute Packages

```typescript
const fetchPackages = async (): Promise<MinutePackage[]> => {
  const response = await fetch('/api/minute-packages');
  if (!response.ok) throw new Error('Failed to fetch packages');
  return await response.json();
};

// Usage with React Query
const { data: packages, isLoading } = useQuery(
  ['minute-packages'],
  fetchPackages
);
```

### Purchase Minutes

```typescript
const handlePurchase = async () => {
  if (!selectedPackage) return;
  
  const purchaseRequest: PurchaseMinutesRequest = {
    packageId: selectedPackage,
    paymentMethod: selectedPaymentMethod
  };
  
  try {
    const response = await fetch('/api/wallet/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchaseRequest)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Purchase failed');
    }
    
    const data: MinutePurchaseResponse = await response.json();
    
    // Handle different payment statuses
    if (data.paymentStatus === "COMPLETED") {
      setShowPurchaseModal(true);
      // Refresh wallet balance
      refetchWalletBalance();
    } else if (data.paymentStatus === "PENDING") {
      // Show pending state
      toast.info('Payment processing...');
    }
  } catch (error) {
    console.error('Purchase error:', error);
    toast.error('Purchase failed. Please try again.');
  }
};
```

### Get Wallet Stats

```typescript
interface WalletStatsResponse {
  availableMinutes: number;
  totalPurchased: number;
  totalSpent: number;
  avgSessionLength: number;
}

const fetchWalletStats = async (): Promise<WalletStatsResponse> => {
  const response = await fetch('/api/wallet/stats');
  if (!response.ok) throw new Error('Failed to fetch stats');
  return await response.json();
};
```

### Get Transaction History

```typescript
const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch('/api/wallet/transactions');
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return await response.json();
};
```

---

## Responsive Breakpoints

### Mobile (< 640px)
```css
- Package grid: 1 column
- Balance stats: Stack vertically (maintain 3 cols if space allows)
- Payment methods: 2 columns (stack if too narrow)
- Sidebar: Full width below main content
- Special offer: Stack icon, text, promo code, button
```

### Tablet (640px - 1024px)
```css
- Package grid: 1-2 columns (depends on space)
- Balance stats: 3 columns
- Payment methods: 2 columns
- Sidebar: Full width below main content
- No sticky positioning on sidebar
```

### Desktop (> 1024px)
```css
- Grid: 3/4 + 1/4 layout (grid-cols-4)
- Package grid: 2 columns
- Balance stats: 3 columns
- Payment methods: 2 columns
- Sidebar: Sticky at top-[120px]
- Special offer: Horizontal layout
```

### Tailwind Breakpoint Classes

```tsx
// Grid Layout
className="grid grid-cols-1 lg:grid-cols-4 gap-8"

// Left Column
className="lg:col-span-3"

// Right Column
className="lg:col-span-1"

// Package Grid
className="grid grid-cols-1 md:grid-cols-2 gap-6"

// Sticky Sidebar (desktop only)
className="sticky top-[120px] space-y-6"
```

---

## Accessibility

### ARIA Labels

```tsx
<button aria-label="View transaction history">
  <History /> View History
</button>

<button 
  aria-label={`Select ${pkg.name} package with ${pkg.minutes} minutes`}
  aria-pressed={selectedPackage === pkg.id}
>
  {/* Package card content */}
</button>

<button 
  aria-label="Select Mobile Money payment method"
  aria-pressed={selectedPaymentMethod === "MOBILE_MONEY"}
>
  <Smartphone /> Mobile Money
</button>

<button aria-label="Complete purchase">
  <Check /> Complete Purchase
</button>
```

### Keyboard Navigation

**Tab Order**:
1. View History button
2. Package cards (tab through all)
3. Payment method buttons
4. Complete Purchase button
5. Sidebar buttons

**Keyboard Actions**:
- **Tab**: Navigate between elements
- **Space/Enter**: Select package, payment method, or complete purchase
- **Escape**: Close modal

### Screen Reader Support

```tsx
<div role="group" aria-labelledby="package-heading">
  <h2 id="package-heading">Choose Your Package</h2>
  {/* Package cards */}
</div>

<div role="radiogroup" aria-labelledby="payment-heading">
  <h3 id="payment-heading">Select Payment Method</h3>
  {/* Payment method buttons */}
</div>

<div role="region" aria-labelledby="history-heading">
  <h2 id="history-heading">Transaction History</h2>
  {/* Transaction list */}
</div>
```

### Focus Management

```tsx
// Focus on modal when opened
useEffect(() => {
  if (showPurchaseModal) {
    modalRef.current?.focus();
  }
}, [showPurchaseModal]);

// Focus on first package when tab is switched
useEffect(() => {
  if (activeTab === 'packages') {
    firstPackageRef.current?.focus();
  }
}, [activeTab]);
```

---

## Testing Checklist

### Visual Testing
- [ ] Balance card displays with gradient
- [ ] Special offer integrated correctly
- [ ] Stats cards show correct data
- [ ] Package grid renders (2 columns desktop)
- [ ] Package badges have correct colors
- [ ] Recommended badge appears on Professional
- [ ] Selection indicator shows on selected package
- [ ] Payment methods display correctly
- [ ] Transaction history renders properly
- [ ] Sidebar cards sticky on desktop
- [ ] Success modal appears correctly

### Functional Testing
- [ ] Tab switching works (Buy Minutes ↔ History)
- [ ] Package selection highlights card
- [ ] Only one package selectable at a time
- [ ] Payment method selection works
- [ ] Purchase button triggers API call
- [ ] Success modal displays after purchase
- [ ] Modal closes on Continue
- [ ] Export button clickable
- [ ] View History button switches tabs
- [ ] Contact Support button works
- [ ] Apply promo code button works

### Responsive Testing
- [ ] Mobile: Single column layout
- [ ] Mobile: Special offer stacks vertically
- [ ] Tablet: Proper grid layout
- [ ] Desktop: 3/4 + 1/4 grid
- [ ] Desktop: Sidebar sticky
- [ ] Desktop: 2-column package grid
- [ ] All breakpoints: Readable text
- [ ] All breakpoints: Clickable buttons

### State Testing
- [ ] Active tab highlighted correctly
- [ ] Selected package highlighted
- [ ] Selected payment method highlighted
- [ ] Modal state managed correctly
- [ ] State persists during tab switch
- [ ] Purchase resets modal state

### API Integration Testing
- [ ] GET /api/minute-packages fetches data
- [ ] POST /api/wallet/purchase creates purchase
- [ ] Success response (201) handled
- [ ] Error responses handled gracefully
- [ ] Loading states display
- [ ] Wallet balance refreshes after purchase
- [ ] Transaction history updates

### Performance Testing
- [ ] Page loads under 2 seconds
- [ ] No layout shift on load
- [ ] Smooth scroll behavior
- [ ] Sticky positioning performs well
- [ ] Modal animates smoothly
- [ ] No memory leaks on unmount

---

## Performance Optimizations

### Implemented
- CSS-only gradients and shadows
- Sticky positioning (CSS-only)
- Conditional rendering for tabs
- Optimized SVG icons (lucide-react)
- Backdrop blur for modern effect

### Recommended

```typescript
// 1. Memoize expensive calculations
const totalPackageValue = useMemo(() => 
  packages.reduce((sum, pkg) => sum + pkg.price, 0),
  [packages]
);

// 2. Cache API data
const { data: packages, isLoading } = useQuery(
  ['minute-packages'],
  fetchPackages,
  { 
    staleTime: 5 * 60 * 1000,  // 5 minutes
    cacheTime: 10 * 60 * 1000  // 10 minutes
  }
);

// 3. Debounce search/filter (if added)
const debouncedSearch = useDebounce(searchQuery, 300);

// 4. Lazy load transaction history
const { data: transactions } = useQuery(
  ['transactions'],
  fetchTransactions,
  { enabled: activeTab === 'history' }  // Only fetch when tab is active
);

// 5. Virtual scrolling for long transaction lists
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: transactions.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 80,
});
```

---

## Common Customizations

### 1. Change Currency

```typescript
// Update price formatting
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMW',
    minimumFractionDigits: 0
  }).format(price);
};

// Usage
<p>ZMW {formatPrice(pkg.price)}</p>
```

### 2. Add New Package Tier

```typescript
const newPackage: MinutePackage = {
  id: "pkg_1000",
  name: "Ultimate",
  minutes: 1000,
  price: 11500,
  description: "Best deal - Save 20%"
};

// Add to packages array
packages.push(newPackage);

// Add badge color
badgeColors["Ultimate"] = {
  bg: "#e0e7ff",
  text: "#4f46e5"
};
```

### 3. Customize Package Badge Colors

```typescript
// Override specific package color
const getBadgeColor = (packageName: string) => {
  if (packageName === "Custom") {
    return { bg: "#your-light-color", text: "#your-dark-color" };
  }
  // ... rest of logic
};
```

### 4. Add New Payment Method

```tsx
<button
  onClick={() => setSelectedPaymentMethod("PAYPAL")}
  className={/* Same structure */}
>
  <DollarSign className="size-6 text-[#2563eb]" />
  <div className="text-left">
    <p className="text-[14px] font-semibold text-[#181818]">PayPal</p>
    <p className="text-[12px] text-[#767676]">Pay with PayPal</p>
  </div>
  {selectedPaymentMethod === "PAYPAL" && (
    <Check className="size-5 text-[#2563eb] ml-auto" />
  )}
</button>
```

### 5. Change Recommended Package

```typescript
const getRecommendedBadge = (packageId: string) => {
  return packageId === "pkg_300"; // Change to Premium
};
```

### 6. Customize Special Offer

```tsx
{/* Update text and promo code */}
<p className="text-[18px] font-bold text-white mb-1">
  Get 20% Bonus Minutes
</p>
<p className="text-[13px] text-white/80">
  Purchase 500+ minutes and receive extra 20% bonus!
</p>
{/* ... */}
<p className="text-[16px] font-mono font-bold text-white">
  MEGA20
</p>
```

---

## Future Enhancements

### Planned Features

1. **Auto Top-Up**
   - Set minimum balance threshold
   - Auto-purchase when minutes run low
   - Email notifications

2. **Subscription Plans**
   - Monthly recurring packages
   - Auto-renewal management
   - Cancellation flow

3. **Gift Cards & Vouchers**
   - Purchase gift minutes
   - Send to other users
   - Redeem voucher codes

4. **Referral Program**
   - Earn bonus minutes for referrals
   - Share referral links
   - Track rewards

5. **Usage Analytics**
   - Spending trends graph
   - Usage patterns chart
   - Minute consumption forecast
   - Package recommendations

6. **Promo Code System**
   - Apply discount codes
   - Validate promo codes
   - Show discount applied
   - Track redemptions

7. **Payment History**
   - Detailed invoice view
   - Download receipts (PDF)
   - Tax documents
   - Payment method history

8. **Bulk Purchases**
   - Volume discounts
   - Enterprise packages
   - Custom quotes
   - Billing options

9. **Minute Transfers**
   - Transfer minutes to friends
   - Gift minutes
   - Split package costs

10. **Installment Payments**
    - Pay over time for large packages
    - Payment plans
    - Credit options

### UI Enhancements

1. **Package Comparison**
   - Side-by-side comparison modal
   - Highlight best value
   - Feature matrix

2. **Animated Transitions**
   - Smooth tab transitions
   - Package selection animation
   - Modal entrance/exit

3. **Loading States**
   - Skeleton loaders
   - Progress indicators
   - Shimmer effects

4. **Empty States**
   - No transactions illustration
   - First purchase CTA
   - Helpful suggestions

5. **Notifications**
   - Toast notifications
   - Success/error feedback
   - Purchase confirmations

---

## Component Usage

### Import

```typescript
import { WalletPage } from "@/app/components/wallet-page";
```

### Basic Usage

```tsx
<WalletPage
  onPurchase={(purchase) => console.log(purchase)}
/>
```

### With API Integration

```tsx
function App() {
  const [packages, setPackages] = useState<MinutePackage[]>([]);
  const [stats, setStats] = useState<WalletStats | null>(null);

  useEffect(() => {
    // Fetch packages
    fetch('/api/minute-packages')
      .then(res => res.json())
      .then(setPackages);

    // Fetch wallet stats
    fetch('/api/wallet/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  const handlePurchase = async (purchase: PurchaseMinutesRequest) => {
    try {
      const response = await fetch('/api/wallet/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchase)
      });
      
      const data: MinutePurchaseResponse = await response.json();
      
      if (data.paymentStatus === "COMPLETED") {
        toast.success('Purchase successful!');
        // Refresh stats
        fetch('/api/wallet/stats')
          .then(res => res.json())
          .then(setStats);
      } else if (data.paymentStatus === "PENDING") {
        toast.info('Payment processing...');
      }
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
  };

  return <WalletPage onPurchase={handlePurchase} />;
}
```

### With React Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function App() {
  const queryClient = useQueryClient();

  // Fetch packages
  const { data: packages } = useQuery(
    ['minute-packages'],
    () => fetch('/api/minute-packages').then(res => res.json())
  );

  // Purchase mutation
  const purchaseMutation = useMutation(
    (purchase: PurchaseMinutesRequest) =>
      fetch('/api/wallet/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchase)
      }).then(res => res.json()),
    {
      onSuccess: (data) => {
        if (data.paymentStatus === "COMPLETED") {
          // Invalidate and refetch
          queryClient.invalidateQueries(['wallet-stats']);
          queryClient.invalidateQueries(['transactions']);
          toast.success('Purchase successful!');
        }
      },
      onError: () => {
        toast.error('Purchase failed. Please try again.');
      }
    }
  );

  return (
    <WalletPage
      onPurchase={(purchase) => purchaseMutation.mutate(purchase)}
    />
  );
}
```

---

## Dependencies

```json
{
  "dependencies": {
    "lucide-react": "^0.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x"
  },
  "devDependencies": {
    "@types/react": "^18.x.x",
    "@types/react-dom": "^18.x.x",
    "typescript": "^5.x.x"
  }
}
```

### Optional Dependencies

```json
{
  "@tanstack/react-query": "^4.x.x",  // For API state management
  "sonner": "^1.x.x",                  // For toast notifications
  "date-fns": "^2.x.x"                 // For date formatting
}
```

---

## Browser Support

- **Chrome/Edge**: Full support (latest 2 versions)
- **Firefox**: Full support (latest 2 versions)
- **Safari**: Full support (latest 2 versions)
- **Mobile Safari**: Full support (iOS 14+)
- **Chrome Mobile**: Full support (Android 10+)

### CSS Features Used
- Backdrop filter (backdrop-blur)
- CSS Grid
- Flexbox
- Custom properties (via Tailwind)
- Sticky positioning
- Gradient backgrounds

---

## Maintenance Notes

### Regular Updates Needed
- Package prices from API
- Wallet balance real-time sync
- Transaction history refresh
- Promo code validation
- Payment method availability

### Security Considerations
- **Never store payment data client-side**
- Transaction IDs for tracking only
- Secure API endpoints (HTTPS)
- Payment gateway integration (PCI compliant)
- Validate all user inputs

### Monitoring
- Track purchase conversion rates
- Monitor failed transactions
- Analyze popular packages
- Track promo code usage
- Monitor API response times

---

## Troubleshooting

### Common Issues

**1. Packages not loading**
```typescript
// Check API response
console.log('Fetching packages...');
const packages = await fetch('/api/minute-packages')
  .then(res => {
    console.log('Response:', res.status);
    return res.json();
  });
```

**2. Purchase not completing**
```typescript
// Add error handling
try {
  const response = await fetch('/api/wallet/purchase', { /* ... */ });
  if (!response.ok) {
    const error = await response.json();
    console.error('Purchase error:', error);
  }
} catch (err) {
  console.error('Network error:', err);
}
```

**3. Sticky sidebar not working**
```css
/* Ensure parent has proper height */
.parent-container {
  min-height: 100vh;
}

/* Check z-index conflicts */
.sticky-sidebar {
  position: sticky;
  top: 120px;
  z-index: 9; /* Must be below header (z-10) */
}
```

**4. Modal not centering**
```css
/* Ensure proper flexbox on container */
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
```

---

## Changelog

### Version 1.0 (January 2026)
- Initial release
- Balance card with gradient design
- Special offer integrated into balance card
- 5 default packages (Starter to Enterprise)
- 2-column package grid
- Two payment methods (Mobile Money, Credit Card)
- Transaction history with purchase/usage types
- Sticky sidebar with "How It Works" and "Need Help?"
- Purchase success modal
- Full responsive design
- API integration ready

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Component**: WalletPage  
**Design System**: ProSupport Marketplace  
**API Endpoints**: `/api/minute-packages`, `/api/wallet/purchase`, `/api/wallet/stats`, `/api/wallet/transactions`  
**Layout**: 3/4 + 1/4 grid with sticky sidebar
