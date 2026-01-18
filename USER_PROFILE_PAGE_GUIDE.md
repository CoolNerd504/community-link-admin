# User Profile Page - Complete Implementation Guide

## Overview

The User Profile Page is a comprehensive, multi-tabbed interface for users to manage their personal information, security settings, wallet, and account preferences. Built following the established ProSupport marketplace design language, it provides a clean, organized way for users to view and edit their profile data based on the UserPayload interface.

## Design Principles

- **Consistent Design Language**: Matches marketplace and provider profile styling
- **Tabbed Navigation**: Organized into Profile, Security, Wallet, and Settings sections
- **Responsive Layout**: Adapts from desktop (3-column) to mobile (stacked)
- **Data-Driven**: Built around the UserPayload TypeScript interface
- **Security-First**: Prominent security features (2FA, biometric, password management)
- **Visual Feedback**: Clear status indicators for verification, security, and transactions

---

## Layout Structure

### Grid System
```
Desktop (lg+):
┌────────────────────────────────────────┐
│  [Profile Card]  │  [Tabbed Content]   │
│   (1 column)     │    (2 columns)      │
└────────────────────────────────────────┘

Mobile:
┌─────────────────┐
│ [Profile Card]  │
├─────────────────┤
│ [Tab Content]   │
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
/src/app/components/user-profile-page.tsx
```

### TypeScript Interfaces

```typescript
interface UserProfile {
  bio: string | null;
  headline: string | null;
  location: string | null;
  languages: string[];
  interests: string[];
  isVerified: boolean;
  vettingStatus: "PENDING" | "APPROVED" | "REJECTED";
  hourlyRate: number | null;
  isOnline: boolean;
  isAvailableForInstant: boolean;
}

interface UserWallet {
  id: string;
  balance: number;
  currency: string;
}

interface UserStats {
  totalSessions: number;
  totalSpent: number;
  savedProviders: number;
  upcomingSessions: number;
}

interface UserPayload {
  // Identity & Auth
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "USER" | "PROVIDER" | "ADMIN";
  username: string | null;
  phoneNumber: string | null;
  
  // Status Flags
  isActive: boolean;
  phoneVerified: boolean;
  emailVerified: Date | null;
  
  // Security
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  
  // KYC
  kycStatus: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";
  kycRejectionReason: string | null;
  
  // Relations
  profile?: UserProfile;
  wallet?: UserWallet;
  stats?: UserStats;
}

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}
```

---

## Section 1: Breadcrumb Navigation

**Location**: Top of page
**Background**: White with bottom border

```tsx
<div className="bg-white border-b border-[#eee]">
  <div className="max-w-[1400px] mx-auto px-8 py-4">
    <button className="flex items-center gap-2 text-[14px] text-[#767676] hover:text-[#181818]">
      <ChevronLeft className="size-4" />
      <span>Back to Dashboard</span>
    </button>
  </div>
</div>
```

**Purpose**: Navigation back to dashboard or previous page

---

## Section 2: Left Column - Profile Card (Sticky)

**Width**: 1/3 of grid (lg:col-span-1)
**Position**: Sticky (top: 32px)
**Card Style**: Backdrop blur, rounded-[24px], shadow

### 2.1 Profile Image Section

**Structure**:
```tsx
<div className="relative w-32 h-32 mx-auto">
  {/* Profile Image */}
  <img className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg" />
  
  {/* Verification Badge (if verified) */}
  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
    <VerificationIcon />
  </div>
  
  {/* Online Status (if online) */}
  <div className="absolute top-2 right-2 size-4 bg-green-500 border-2 border-white rounded-full" />
  
  {/* Edit Button */}
  <button className="absolute bottom-0 right-0 size-10 bg-[#2563eb] rounded-full">
    <Camera className="size-5" />
  </button>
</div>
```

**Elements**:
- Image: 128x128px, rounded-full
- Border: 4px white
- Shadow: Large drop shadow
- Verification: Bottom center
- Online dot: Top right (4px green dot)
- Camera button: Bottom right (40px blue circle)

### 2.2 User Info Section

```tsx
<div className="text-center mb-6">
  <h1 className="text-[24px] font-bold text-[#181818] mb-1">
    {user.name}
  </h1>
  <p className="text-[15px] text-[#767676] mb-2">
    @{user.username}
  </p>
  <p className="text-[14px] text-[#181818] mb-3">
    {user.profile?.headline}
  </p>
  
  {/* Role & Status Badges */}
  <div className="flex items-center justify-center gap-2 mb-4">
    <span className="px-3 py-1 rounded-full text-[13px] font-semibold bg-[#dbeafe] text-[#2563eb]">
      {user.role}
    </span>
    {user.isActive && (
      <span className="px-3 py-1 bg-[#dcfce7] text-[#16a34a] rounded-full text-[13px] font-semibold">
        Active
      </span>
    )}
  </div>
</div>
```

**Role Badge Colors**:
- USER: Blue (#dbeafe background, #2563eb text)
- PROVIDER: Purple (#f3e8ff background, #9333ea text)
- ADMIN: Red (#fee2e2 background, #ef4444 text)

### 2.3 Quick Stats Grid

**Layout**: 2-column grid
**Gap**: 16px

```tsx
<div className="grid grid-cols-2 gap-4 mb-6">
  <div className="bg-[#f5f5f5] rounded-[16px] p-4 text-center">
    <p className="text-[24px] font-bold text-[#181818] mb-1">24</p>
    <p className="text-[12px] text-[#767676]">Sessions</p>
  </div>
  <div className="bg-[#f5f5f5] rounded-[16px] p-4 text-center">
    <p className="text-[24px] font-bold text-[#181818] mb-1">8</p>
    <p className="text-[12px] text-[#767676]">Saved</p>
  </div>
</div>
```

### 2.4 Contact Information

**Background**: #f5f5f5
**Border Radius**: 12px
**Padding**: 12px
**Gap**: 12px between items

```tsx
<div className="space-y-3 mb-6">
  {/* Email */}
  <div className="flex items-center gap-3 p-3 bg-[#f5f5f5] rounded-[12px]">
    <Mail className="size-5 text-[#767676]" />
    <div className="flex-1 min-w-0">
      <p className="text-[13px] text-[#181818] truncate">{user.email}</p>
    </div>
    {user.emailVerified ? (
      <CheckCircle className="size-5 text-[#16a34a]" />
    ) : (
      <XCircle className="size-5 text-[#ef4444]" />
    )}
  </div>
  
  {/* Phone */}
  <div className="flex items-center gap-3 p-3 bg-[#f5f5f5] rounded-[12px]">
    <Phone className="size-5 text-[#767676]" />
    <p className="text-[13px] text-[#181818]">{user.phoneNumber}</p>
    {user.phoneVerified ? (
      <CheckCircle className="size-5 text-[#16a34a]" />
    ) : (
      <XCircle className="size-5 text-[#ef4444]" />
    )}
  </div>
  
  {/* Location */}
  <div className="flex items-center gap-3 p-3 bg-[#f5f5f5] rounded-[12px]">
    <MapPin className="size-5 text-[#767676]" />
    <p className="text-[13px] text-[#181818]">{user.profile?.location}</p>
  </div>
</div>
```

**Verification Icons**:
- Verified: Green CheckCircle (#16a34a)
- Not Verified: Red XCircle (#ef4444)

### 2.5 Edit Profile Button

```tsx
<button className="w-full bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8]">
  <Edit className="size-5" />
  Edit Profile
</button>
```

---

## Section 3: Right Column - Tabbed Content

**Width**: 2/3 of grid (lg:col-span-2)

### 3.1 Tab Navigation

**Container**: Backdrop blur card with padding
**Layout**: Flex with equal-width tabs

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-2 mb-6">
  <div className="flex gap-2">
    {tabs.map(tab => (
      <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-[14px] font-semibold ${
        activeTab === tab.id
          ? "bg-[#2563eb] text-white shadow-md"
          : "text-[#767676] hover:bg-[#f5f5f5] hover:text-[#181818]"
      }`}>
        <tab.icon className="size-4" />
        <span className="hidden sm:inline">{tab.label}</span>
      </button>
    ))}
  </div>
</div>
```

**Tabs**:
1. Profile (User icon)
2. Security (Shield icon)
3. Wallet (CreditCard icon)
4. Settings (Settings icon)

**Active State**:
- Background: #2563eb (blue)
- Text: White
- Shadow: Medium

**Inactive State**:
- Background: Transparent
- Text: #767676
- Hover: #f5f5f5 background

---

## Tab 1: Profile

### About Section

```tsx
<div>
  <h2 className="text-[20px] font-bold text-[#181818] mb-4">About</h2>
  {user.profile?.bio ? (
    <p className="text-[15px] text-[#767676] leading-relaxed">
      {user.profile.bio}
    </p>
  ) : (
    <div className="bg-[#f5f5f5] rounded-[16px] p-6 text-center">
      <p className="text-[14px] text-[#a2a2a2]">No bio added yet</p>
      <button className="mt-3 text-[14px] font-semibold text-[#2563eb]">
        Add Bio
      </button>
    </div>
  )}
</div>
```

### Languages Section

```tsx
<div>
  <h2 className="text-[20px] font-bold text-[#181818] mb-4">Languages</h2>
  <div className="flex flex-wrap gap-2">
    {user.profile?.languages.map((language) => (
      <span className="px-4 py-2 bg-[#f5f5f5] text-[#181818] rounded-[12px] text-[14px] font-medium">
        <Languages className="inline size-4 mr-2 text-[#767676]" />
        {language}
      </span>
    ))}
  </div>
</div>
```

**Pill Style**:
- Background: #f5f5f5
- Padding: 16px horizontal, 8px vertical
- Border radius: 12px
- Icon: Languages (inline, 16px)

### Interests Section

```tsx
<div>
  <h2 className="text-[20px] font-bold text-[#181818] mb-4">Interests</h2>
  <div className="flex flex-wrap gap-2">
    {user.profile?.interests.map((interest) => (
      <span className="px-4 py-2 bg-[#f0f4ff] text-[#2563eb] rounded-[12px] text-[14px] font-medium">
        {interest}
      </span>
    ))}
  </div>
</div>
```

**Interest Pills**:
- Background: #f0f4ff (light blue)
- Text: #2563eb (blue)
- No icon

### KYC Verification Status

```tsx
<div>
  <h2 className="text-[20px] font-bold text-[#181818] mb-4">Verification Status</h2>
  <div className={`p-4 rounded-[16px] border-2 ${
    user.kycStatus === "VERIFIED" ? "border-[#16a34a] bg-[#dcfce7]" :
    user.kycStatus === "SUBMITTED" ? "border-[#f59e0b] bg-[#fef3c7]" :
    user.kycStatus === "REJECTED" ? "border-[#ef4444] bg-[#fee2e2]" :
    "border-[#767676] bg-[#f5f5f5]"
  }`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Icon based on status */}
        {user.kycStatus === "VERIFIED" && <CheckCircle className="size-6 text-[#16a34a]" />}
        {user.kycStatus === "SUBMITTED" && <Clock className="size-6 text-[#f59e0b]" />}
        {user.kycStatus === "REJECTED" && <XCircle className="size-6 text-[#ef4444]" />}
        {user.kycStatus === "PENDING" && <AlertCircle className="size-6 text-[#767676]" />}
        
        <div>
          <p className="text-[15px] font-semibold text-[#181818]">KYC Status</p>
          <p className="text-[13px] text-[#767676]">Status description</p>
        </div>
      </div>
      
      <span className={`px-3 py-1 rounded-full text-[13px] font-semibold ${
        user.kycStatus === "VERIFIED" ? "bg-[#16a34a] text-white" :
        user.kycStatus === "SUBMITTED" ? "bg-[#f59e0b] text-white" :
        user.kycStatus === "REJECTED" ? "bg-[#ef4444] text-white" :
        "bg-[#767676] text-white"
      }`}>
        {user.kycStatus}
      </span>
    </div>
  </div>
</div>
```

**KYC Status Colors**:
- VERIFIED: Green border/background (#16a34a / #dcfce7)
- SUBMITTED: Orange border/background (#f59e0b / #fef3c7)
- REJECTED: Red border/background (#ef4444 / #fee2e2)
- PENDING: Gray border/background (#767676 / #f5f5f5)

---

## Tab 2: Security

### Two-Factor Authentication Card

```tsx
<div className="p-6 bg-[#f5f5f5] rounded-[16px]">
  <div className="flex items-start justify-between">
    <div className="flex items-start gap-4">
      <div className="size-12 bg-[#f3e8ff] rounded-[12px] flex items-center justify-center">
        <Shield className="size-6 text-[#9333ea]" />
      </div>
      <div>
        <h3 className="text-[16px] font-semibold text-[#181818] mb-1">
          Two-Factor Authentication
        </h3>
        <p className="text-[13px] text-[#767676] mb-2">
          Add an extra layer of security to your account
        </p>
        {user.twoFactorEnabled && (
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#16a34a]">
            <CheckCircle className="size-4" />
            Enabled
          </span>
        )}
      </div>
    </div>
    <button className={`px-4 py-2 rounded-[12px] text-[14px] font-semibold ${
      user.twoFactorEnabled
        ? "bg-[#fee2e2] text-[#ef4444] hover:bg-[#fecaca]"
        : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
    }`}>
      {user.twoFactorEnabled ? "Disable" : "Enable"}
    </button>
  </div>
</div>
```

**Icon Container Colors**:
- 2FA: Purple (#f3e8ff background, #9333ea icon)
- Biometric: Blue (#e3f2fd background, #2563eb icon)
- Password: Green (#dcfce7 background, #16a34a icon)

### Biometric Authentication Card

Same structure as 2FA, different colors:
- Icon: Fingerprint
- Background: #e3f2fd
- Icon color: #2563eb

### Change Password Form

```tsx
<div className="p-6 bg-[#f5f5f5] rounded-[16px]">
  <div className="flex items-start gap-4 mb-4">
    <div className="size-12 bg-[#dcfce7] rounded-[12px] flex items-center justify-center">
      <Lock className="size-6 text-[#16a34a]" />
    </div>
    <div>
      <h3 className="text-[16px] font-semibold text-[#181818] mb-1">
        Change Password
      </h3>
      <p className="text-[13px] text-[#767676]">
        Update your password regularly to keep your account secure
      </p>
    </div>
  </div>
  
  <div className="space-y-3">
    {/* Current Password */}
    <div>
      <label className="block text-[13px] font-semibold text-[#181818] mb-2">
        Current Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full px-4 py-3 rounded-[12px] border border-[#eee] bg-white text-[14px] focus:outline-none focus:border-[#2563eb]"
          placeholder="Enter current password"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2">
          <Eye/EyeOff className="size-5 text-[#767676]" />
        </button>
      </div>
    </div>
    
    {/* New Password */}
    <div>
      <label className="block text-[13px] font-semibold text-[#181818] mb-2">
        New Password
      </label>
      <input
        type="password"
        className="w-full px-4 py-3 rounded-[12px] border border-[#eee] bg-white text-[14px] focus:outline-none focus:border-[#2563eb]"
        placeholder="Enter new password"
      />
    </div>
    
    {/* Confirm Password */}
    <div>
      <label className="block text-[13px] font-semibold text-[#181818] mb-2">
        Confirm New Password
      </label>
      <input
        type="password"
        className="w-full px-4 py-3 rounded-[12px] border border-[#eee] bg-white text-[14px] focus:outline-none focus:border-[#2563eb]"
        placeholder="Confirm new password"
      />
    </div>
    
    <button className="w-full bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8] mt-2">
      Update Password
    </button>
  </div>
</div>
```

**Input Styling**:
- Padding: 16px horizontal, 12px vertical
- Border: 1px solid #eee
- Background: White
- Focus: Blue border (#2563eb)

---

## Tab 3: Wallet

### Balance Card (Gradient)

```tsx
<div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-[24px] p-8 text-white">
  <div className="flex items-start justify-between mb-6">
    <div>
      <p className="text-[14px] text-white/80 mb-2">Available Balance</p>
      <p className="text-[36px] font-bold">
        USD 1,250.50
      </p>
    </div>
    <div className="size-12 bg-white/20 rounded-[12px] flex items-center justify-center">
      <CreditCard className="size-6" />
    </div>
  </div>
  
  <div className="flex gap-3">
    <button className="flex-1 bg-white text-[#2563eb] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-white/90">
      Add Funds
    </button>
    <button className="flex-1 bg-white/20 text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-white/30">
      Withdraw
    </button>
  </div>
</div>
```

**Gradient**: from-[#2563eb] to-[#1d4ed8]
**Text**: White with 80% opacity for secondary text
**Buttons**: 
- Primary: White bg, blue text
- Secondary: White/20 bg, white text

### Quick Stats Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="bg-[#f5f5f5] rounded-[16px] p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
        <TrendingUp className="size-5 text-[#16a34a]" />
      </div>
      <div>
        <p className="text-[13px] text-[#767676]">Total Spent</p>
        <p className="text-[20px] font-bold text-[#181818]">USD 3,250</p>
      </div>
    </div>
  </div>
  
  <div className="bg-[#f5f5f5] rounded-[16px] p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
        <Calendar className="size-5 text-[#2563eb]" />
      </div>
      <div>
        <p className="text-[13px] text-[#767676]">This Month</p>
        <p className="text-[20px] font-bold text-[#181818]">USD 975</p>
      </div>
    </div>
  </div>
</div>
```

### Transaction History

```tsx
<div>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-[20px] font-bold text-[#181818]">Recent Transactions</h2>
    <button className="text-[14px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1">
      View All
      <ArrowUpRight className="size-4" />
    </button>
  </div>
  
  <div className="space-y-3">
    {transactions.map(transaction => (
      <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px] hover:bg-[#efefef]">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-[12px] flex items-center justify-center ${
            transaction.type === "credit" ? "bg-[#dcfce7]" : "bg-[#fee2e2]"
          }`}>
            {transaction.type === "credit" ? (
              <TrendingUp className="size-5 text-[#16a34a]" />
            ) : (
              <ArrowUpRight className="size-5 text-[#ef4444]" />
            )}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#181818]">
              {transaction.description}
            </p>
            <p className="text-[12px] text-[#767676]">{transaction.date}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-[16px] font-bold ${
            transaction.type === "credit" ? "text-[#16a34a]" : "text-[#ef4444]"
          }`}>
            {transaction.type === "credit" ? "+" : "-"}USD {transaction.amount.toFixed(2)}
          </p>
          <span className={`text-[11px] font-semibold ${
            transaction.status === "completed" ? "text-[#16a34a]" :
            transaction.status === "pending" ? "text-[#f59e0b]" :
            "text-[#ef4444]"
          }`}>
            {transaction.status}
          </span>
        </div>
      </div>
    ))}
  </div>
  
  <button className="w-full mt-4 py-3 rounded-[16px] border-2 border-dashed border-[#eee] text-[14px] font-semibold text-[#767676] hover:border-[#2563eb] hover:text-[#2563eb] flex items-center justify-center gap-2">
    <Download className="size-4" />
    Download Statement
  </button>
</div>
```

**Transaction Colors**:
- Credit: Green (#dcfce7 bg, #16a34a text/icon)
- Debit: Red (#fee2e2 bg, #ef4444 text/icon)

**Status Colors**:
- Completed: Green (#16a34a)
- Pending: Orange (#f59e0b)
- Failed: Red (#ef4444)

---

## Tab 4: Settings

### Notification Preferences

```tsx
<div className="p-6 bg-[#f5f5f5] rounded-[16px]">
  {/* Email Notifications */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <Bell className="size-5 text-[#767676]" />
      <div>
        <h3 className="text-[15px] font-semibold text-[#181818]">Email Notifications</h3>
        <p className="text-[13px] text-[#767676]">Receive updates via email</p>
      </div>
    </div>
    
    {/* Toggle Switch */}
    <label className="relative inline-block w-12 h-6">
      <input type="checkbox" className="sr-only peer" defaultChecked />
      <div className="w-full h-full bg-[#a2a2a2] peer-checked:bg-[#2563eb] rounded-full transition-colors cursor-pointer"></div>
      <div className="absolute left-1 top-1 size-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
    </label>
  </div>
  
  {/* Push Notifications */}
  {/* Same structure */}
  
  {/* SMS Notifications */}
  {/* Same structure */}
</div>
```

**Toggle Switch**:
- Width: 48px
- Height: 24px
- Track: Gray (#a2a2a2) / Blue (#2563eb) when checked
- Knob: 16px white circle
- Transition: translate-x-6 when checked

### Privacy Settings

```tsx
<div className="p-6 bg-[#f5f5f5] rounded-[16px]">
  <h3 className="text-[16px] font-semibold text-[#181818] mb-4">Privacy</h3>
  
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-[#181818]">Show profile in search</span>
      <label className="relative inline-block w-12 h-6">
        {/* Toggle switch */}
      </label>
    </div>
    
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-[#181818]">Show online status</span>
      <label className="relative inline-block w-12 h-6">
        {/* Toggle switch */}
      </label>
    </div>
    
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-[#181818]">Allow messages from anyone</span>
      <label className="relative inline-block w-12 h-6">
        {/* Toggle switch */}
      </label>
    </div>
  </div>
</div>
```

### Danger Zone

```tsx
<div className="p-6 bg-[#fee2e2] rounded-[16px] border-2 border-[#ef4444]">
  <h3 className="text-[16px] font-semibold text-[#ef4444] mb-2">Danger Zone</h3>
  <p className="text-[13px] text-[#767676] mb-4">
    These actions are permanent and cannot be undone
  </p>
  
  <div className="space-y-2">
    <button className="w-full bg-white text-[#ef4444] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#fef2f2] border border-[#ef4444]">
      Deactivate Account
    </button>
    <button className="w-full bg-[#ef4444] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#dc2626]">
      Delete Account
    </button>
  </div>
</div>
```

**Danger Zone Styling**:
- Background: #fee2e2 (light red)
- Border: 2px solid #ef4444 (red)
- Title: #ef4444 (red)
- Buttons: Red theme

---

## Icons Used (lucide-react)

```javascript
import {
  User,           // Profile tab
  Mail,           // Email
  Phone,          // Phone number
  MapPin,         // Location
  Globe,          // Language (alternative)
  ChevronLeft,    // Back navigation
  Shield,         // 2FA
  Lock,           // Password
  Fingerprint,    // Biometric
  CreditCard,     // Wallet
  Settings,       // Settings tab
  Bell,           // Notifications
  Eye,            // Show password
  EyeOff,         // Hide password
  CheckCircle,    // Verified/completed
  XCircle,        // Not verified/failed
  AlertCircle,    // Warning/pending
  Clock,          // Time/submitted
  Calendar,       // Calendar/date
  TrendingUp,     // Growth/credit
  DollarSign,     // Money
  Download,       // Download statement
  ArrowUpRight,   // External link/debit
  Edit,           // Edit profile
  Camera,         // Change photo
  Heart,          // Favorites (future)
  Zap,            // Quick/instant
  Languages       // Languages icon
} from "lucide-react";
```

---

## Responsive Breakpoints

```css
/* Mobile (< 640px) */
- Single column layout
- Tabs show icons only
- Profile card unsticky

/* Tablet (640px - 1024px) */
- Profile card: Full width
- Content: Full width below
- Stats: 2-column grid

/* Desktop (> 1024px) */
- 3-column grid (1/3 profile, 2/3 content)
- Profile card sticky
- Tabs show icon + label
```

---

## State Management

### React State

```typescript
const [activeTab, setActiveTab] = useState("profile");
const [showPassword, setShowPassword] = useState(false);
const [editMode, setEditMode] = useState(false);
```

### Mock Data

```typescript
const mockUser: UserPayload = {
  id: "user-123",
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  image: "...",
  role: "USER",
  username: "alexrivera",
  phoneNumber: "+1 (555) 123-4567",
  isActive: true,
  phoneVerified: true,
  emailVerified: new Date("2024-01-15"),
  biometricEnabled: true,
  twoFactorEnabled: false,
  kycStatus: "VERIFIED",
  kycRejectionReason: null,
  profile: {
    bio: "...",
    headline: "Product Manager & Tech Enthusiast",
    location: "San Francisco, CA",
    languages: ["English", "Spanish", "French"],
    interests: ["UI/UX Design", "Product Management", "Startups"],
    isVerified: true,
    vettingStatus: "APPROVED",
    hourlyRate: null,
    isOnline: true,
    isAvailableForInstant: false
  },
  wallet: {
    id: "wallet-123",
    balance: 1250.50,
    currency: "USD"
  },
  stats: {
    totalSessions: 24,
    totalSpent: 3250,
    savedProviders: 8,
    upcomingSessions: 3
  }
};
```

---

## API Integration Points

### Endpoints (Future Implementation)

```typescript
// Fetch user profile
GET /api/user/me
Response: UserPayload

// Update profile
PATCH /api/user/profile
Body: { bio, headline, location, languages, interests }
Response: UserProfile

// Upload profile image
POST /api/user/image
Body: FormData
Response: { imageUrl }

// Update security settings
PATCH /api/user/security
Body: { twoFactorEnabled, biometricEnabled }
Response: { success }

// Change password
POST /api/user/password
Body: { currentPassword, newPassword }
Response: { success }

// Submit KYC
POST /api/user/kyc
Body: { documents, personalInfo }
Response: { kycStatus }

// Fetch wallet
GET /api/user/wallet
Response: UserWallet

// Fetch transactions
GET /api/user/wallet/transactions
Response: Transaction[]

// Add funds
POST /api/user/wallet/deposit
Body: { amount, paymentMethod }
Response: { transactionId }

// Update settings
PATCH /api/user/settings
Body: { emailNotifications, pushNotifications, smsNotifications, privacy }
Response: { success }
```

---

## Color System

### Status Colors

```css
/* Success/Verified */
--success: #16a34a;
--success-light: #dcfce7;

/* Warning/Pending */
--warning: #f59e0b;
--warning-light: #fef3c7;

/* Error/Rejected */
--error: #ef4444;
--error-light: #fee2e2;

/* Info/Active */
--info: #2563eb;
--info-light: #dbeafe;
--info-lighter: #f0f4ff;

/* Purple (Provider/Premium) */
--purple: #9333ea;
--purple-light: #f3e8ff;
```

### Role Colors

```css
/* USER */
background: #dbeafe;
color: #2563eb;

/* PROVIDER */
background: #f3e8ff;
color: #9333ea;

/* ADMIN */
background: #fee2e2;
color: #ef4444;
```

---

## Accessibility

### ARIA Labels

```tsx
<button aria-label="Edit profile picture">
  <Camera />
</button>

<button aria-label="Toggle two-factor authentication">
  Enable
</button>

<input
  type="password"
  aria-label="Current password"
  placeholder="Enter current password"
/>
```

### Keyboard Navigation

- All form fields tabbable
- Toggle switches keyboard accessible
- Tab navigation between tabs
- Escape to close modals (future)

### Screen Reader Support

- Verification status announced
- Transaction type and amount announced
- Error messages for forms
- Success confirmations

---

## Interactive States

### Hover States

```css
/* Buttons */
button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Cards */
.transaction-card:hover {
  background: #efefef;
}

/* Links */
a:hover {
  color: #1d4ed8;
}
```

### Focus States

```css
/* Inputs */
input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Buttons */
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

### Active States

```css
/* Tabs */
.tab-active {
  background: #2563eb;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Toggle switches */
.toggle:checked {
  background: #2563eb;
}
```

---

## Component Usage

### Import

```typescript
import { UserProfilePage } from "@/app/components/user-profile-page";
```

### Basic Usage

```tsx
<UserProfilePage
  user={currentUser}
  onBack={() => navigate("/dashboard")}
/>
```

### Props

```typescript
interface UserProfilePageProps {
  user: UserPayload;       // User data
  onBack?: () => void;     // Back navigation callback
}
```

---

## Future Enhancements

### Planned Features

1. **Edit Mode**
   - Inline editing for bio, headline
   - Drag-and-drop profile image
   - Add/remove languages and interests

2. **Activity Feed**
   - Recent sessions
   - Achievements
   - Milestones

3. **Connected Accounts**
   - Link social media
   - OAuth providers
   - Third-party integrations

4. **Subscription Management**
   - If user has premium features
   - Billing history
   - Upgrade/downgrade

5. **Referral Program**
   - Referral code
   - Invited users
   - Rewards earned

6. **Session History**
   - Past sessions as user
   - Ratings given
   - Downloadable certificates

7. **Preferences**
   - Theme selection (light/dark)
   - Language preference
   - Currency selection

8. **Data Export**
   - GDPR compliance
   - Download all data
   - Account portability

---

## Testing Checklist

### Visual Testing
- [ ] Profile image displays correctly
- [ ] Verification badge shows when verified
- [ ] Online status indicator appears
- [ ] Role badges show correct colors
- [ ] Tab switching works smoothly
- [ ] Forms render properly
- [ ] Transaction history displays
- [ ] Wallet balance shows correctly

### Functional Testing
- [ ] Tab navigation works
- [ ] Password visibility toggle functions
- [ ] Toggle switches respond to clicks
- [ ] Back button navigates correctly
- [ ] Edit profile button works
- [ ] Forms validate input
- [ ] API calls work (when integrated)

### Responsive Testing
- [ ] Mobile: Single column layout
- [ ] Tablet: Proper stacking
- [ ] Desktop: 3-column grid
- [ ] Profile card sticky on desktop
- [ ] Tabs responsive (icon-only on mobile)

### State Testing
- [ ] Active tab highlights correctly
- [ ] Security toggles reflect state
- [ ] KYC status displays properly
- [ ] Transaction type colors correct
- [ ] Verification icons show/hide

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] ARIA labels present
- [ ] Focus indicators visible
- [ ] Color contrast sufficient

---

## Performance Optimizations

### Implemented
- Sticky positioning (CSS-only)
- Transitions use transform/opacity
- Conditional rendering of sections
- SVG icons (lucide-react)

### Recommended

```typescript
// Lazy load tabs
const ProfileTab = lazy(() => import('./tabs/profile-tab'));
const SecurityTab = lazy(() => import('./tabs/security-tab'));
const WalletTab = lazy(() => import('./tabs/wallet-tab'));
const SettingsTab = lazy(() => import('./tabs/settings-tab'));

// Memoize expensive computations
const transactionTotal = useMemo(() => 
  transactions.reduce((sum, t) => sum + t.amount, 0),
  [transactions]
);

// Debounce search/filter
const debouncedSearch = useDebounce(searchQuery, 300);

// Virtual scrolling for long transaction lists
import { FixedSizeList } from 'react-window';
```

---

## Common Customizations

### Change Primary Color

```typescript
// Replace all instances of #2563eb with your color
const primaryColor = "#your-color";
const primaryDark = "#your-color-dark";
```

### Add Custom Tab

```tsx
// 1. Add to tabs array
{ id: "custom", label: "Custom", icon: YourIcon }

// 2. Add tab content
{activeTab === "custom" && (
  <div className="space-y-6">
    {/* Your custom content */}
  </div>
)}
```

### Modify Transaction Display

```tsx
// Change currency display
<p className="text-[16px] font-bold">
  {wallet.currency} {transaction.amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}
</p>
```

### Add More Stats

```tsx
<div className="grid grid-cols-3 gap-4 mb-6">
  <div className="bg-[#f5f5f5] rounded-[16px] p-4 text-center">
    <p className="text-[24px] font-bold text-[#181818] mb-1">{stat.value}</p>
    <p className="text-[12px] text-[#767676]">{stat.label}</p>
  </div>
  {/* Repeat */}
</div>
```

---

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile Safari: Full support
- Chrome Mobile: Full support

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
```

---

## Maintenance Notes

### Regular Updates
- User data fetched on mount
- Wallet balance refreshed periodically
- Transaction history paginated
- KYC status checked on profile view

### Security Considerations
- Password change requires current password
- 2FA changes trigger email notification
- Biometric changes require re-authentication
- Account deletion requires confirmation modal

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Component**: UserProfilePage  
**Design System**: ProSupport Marketplace
