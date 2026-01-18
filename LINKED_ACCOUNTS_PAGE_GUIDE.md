# Linked Accounts Page - Complete Implementation Guide

## Overview

The Linked Accounts Page allows users to connect and manage third-party identity providers (Google, GitHub, Facebook, Twitter, LinkedIn, Microsoft) for easier sign-in and enhanced security. Built following the ProSupport marketplace design language and structured around NextAuth.js Account model with OAuth providers.

## Design Principles

- **OAuth Integration**: Built for NextAuth.js standard OAuth flow
- **Security First**: Clear messaging about OAuth 2.0 security
- **Visual Provider Identity**: Authentic brand colors and logos
- **Clear Status Indicators**: Connected vs Available states
- **Confirmation Protection**: Modal confirmation before unlinking
- **Consistent Design Language**: Matches all other ProSupport components
- **Smart Layout**: 3/4 + 1/4 grid with sticky sidebar

---

## API Payload Structure

### Get Linked Accounts

**Endpoint**: `GET /api/user/accounts`

**Response Payload**:
```typescript
type LinkedAccountsResponse = LinkedAccount[];

interface LinkedAccount {
  id: string;
  provider: string;
  type: string;
  createdAt: string;
}
```

**Example Response**:
```json
[
  {
    "id": "cuid_123456",
    "provider": "google",
    "type": "oauth",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "cuid_789012",
    "provider": "github",
    "type": "oauth",
    "createdAt": "2024-01-05T00:00:00.000Z"
  }
]
```

### Link Account

**Endpoint**: `POST /api/auth/signin/{provider}` (Standard NextAuth)

**Description**: Initiates OAuth flow to link a new provider

**Flow**:
1. User clicks "Connect" button
2. Frontend redirects to `/api/auth/signin/{provider}`
3. NextAuth handles OAuth flow
4. User is redirected back after authentication
5. Account is linked automatically

### Unlink Account

**Endpoint**: `DELETE /api/user/accounts/{provider}`

**Description**: Removes a linked provider from user's account

**Request**: None (Provider specified in URL)

**Success Response**:
```json
{
  "message": "Account unlinked successfully"
}
```

**Error Response**:
```json
{
  "error": "Cannot unlink last authentication method"
}
```

---

## Data Model (Prisma)

```prisma
model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String  // e.g., "oauth"
  provider           String  // e.g., "google", "github"
  providerAccountId  String  // ID from external provider
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}
```

---

## Layout Structure

### Grid System

```
Desktop (lg+):
┌────────────────────────────────────────────────────────────┐
│  Header (Sticky top-0, z-10)                               │
│  [Title + Connected Count Badge]                           │
├─────────────────────────────────────────┬──────────────────┤
│  Left Column (3/4 width - Scrollable)   │  Right (1/4)     │
│                                          │                  │
│  ┌────────────────────────────────────┐ │  ┌────────────┐ │
│  │ Connected Accounts (If Any)        │ │  │ Why Link   │ │
│  │ ┌──────────┬──────────┐            │ │  │ Accounts?  │ │
│  │ │ Google   │ GitHub   │            │ │  │            │ │
│  │ │ Connected│ Connected│ (2 cols)   │ │  │ Sticky!    │ │
│  │ └──────────┴──────────┘            │ │  │ top-120px  │ │
│  └────────────────────────────────────┘ │  │            │ │
│                                          │  │ Benefits   │ │
│  ┌────────────────────────────────────┐ │  └────────────┘ │
│  │ Available to Connect               │ │                  │
│  │ ┌──────────┬──────────┐            │ │  ┌────────────┐ │
│  │ │ Facebook │ Twitter  │            │ │  │ Security   │ │
│  │ │ Connect  │ Connect  │ (2 cols)   │ │  │ Notice     │ │
│  │ └──────────┴──────────┘            │ │  │            │ │
│  │ ┌──────────┬──────────┐            │ │  │ Sticky!    │ │
│  │ │ LinkedIn │Microsoft │            │ │  └────────────┘ │
│  │ └──────────┴──────────┘            │ │                  │
│  └────────────────────────────────────┘ │  ┌────────────┐ │
│                                          │  │ Need Help? │ │
│  (Scrollable content)                    │  │            │ │
│                                          │  │ Sticky!    │ │
│                                          │  └────────────┘ │
└─────────────────────────────────────────┴──────────────────┘

Mobile (< 1024px):
┌─────────────────┐
│ Header          │
│ + Count Badge   │
├─────────────────┤
│ Why Link?       │
├─────────────────┤
│ Security Notice │
├─────────────────┤
│ Need Help?      │
├─────────────────┤
│ Connected       │
│ Accounts        │
│ (1 column)      │
├─────────────────┤
│ Available       │
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
      {/* All cards sticky together */}
    </div>
  </div>
</div>
```

---

## Component Structure

### File Location
```
/src/app/components/linked-accounts-page.tsx
```

### TypeScript Interfaces

```typescript
// From API
interface LinkedAccount {
  id: string;
  provider: string;
  type: string;
  createdAt: string;
}

// Provider Configuration
interface ProviderConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;      // Brand primary color
  bgColor: string;    // Light background
}

// Component Props
interface LinkedAccountsPageProps {
  onLink?: (provider: string) => void;
  onUnlink?: (provider: string) => void;
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
          Linked Accounts
        </h1>
        <p className="text-[15px] text-[#767676]">
          Connect your accounts for easier access and enhanced security
        </p>
      </div>
      
      {/* Connected Count Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] rounded-[12px]">
          <div className="size-2 bg-[#16a34a] rounded-full"></div>
          <span className="text-[14px] font-semibold text-[#181818]">
            {connectedCount} Connected
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Elements**:
- Title: "Linked Accounts" (28px, bold, #181818)
- Subtitle: Descriptive text (15px, #767676)
- Connected Count Badge:
  - Green dot indicator (8px circle)
  - Count text (14px, semibold)
  - Light gray background (#f5f5f5)

---

## Section 2: Provider Configurations

### Supported Providers

```typescript
const providers: ProviderConfig[] = [
  {
    id: "google",
    name: "Google",
    icon: <GoogleIcon />,  // SVG with official colors
    description: "Sign in with your Google account",
    color: "#4285F4",
    bgColor: "#E8F0FE"
  },
  {
    id: "github",
    name: "GitHub",
    icon: <GitHubIcon />,
    description: "Connect your GitHub account",
    color: "#181717",
    bgColor: "#F6F8FA"
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <FacebookIcon />,
    description: "Link your Facebook profile",
    color: "#1877F2",
    bgColor: "#E7F3FF"
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: <TwitterIcon />,
    description: "Connect with Twitter",
    color: "#1DA1F2",
    bgColor: "#E8F5FD"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <LinkedInIcon />,
    description: "Link your LinkedIn profile",
    color: "#0A66C2",
    bgColor: "#E7F3FF"
  },
  {
    id: "microsoft",
    name: "Microsoft",
    icon: <MicrosoftIcon />,
    description: "Connect your Microsoft account",
    color: "#00A4EF",
    bgColor: "#E7F3FF"
  }
];
```

### Provider Icons

All icons are SVG React components with official brand colors. Examples:

**Google Icon**:
```tsx
<svg className="size-6" viewBox="0 0 24 24" fill="none">
  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." fill="#4285F4"/>
  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77..." fill="#34A853"/>
  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43..." fill="#FBBC05"/>
  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15..." fill="#EA4335"/>
</svg>
```

**GitHub Icon**:
```tsx
<svg className="size-6" viewBox="0 0 24 24" fill="#181717">
  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8..."/>
</svg>
```

---

## Section 3: Connected Accounts

**Visibility**: Only shown when user has linked accounts (connectedCount > 0)
**Location**: Left column, top section

```tsx
{connectedCount > 0 && (
  <div className="mb-8">
    {/* Section Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-[20px] font-bold text-[#181818] mb-1">
          Connected Accounts
        </h2>
        <p className="text-[14px] text-[#767676]">
          Accounts you've linked to your profile
        </p>
      </div>
    </div>

    {/* Provider Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {providers.filter(provider => isLinked(provider.id)).map((provider) => {
        const account = getLinkedAccount(provider.id);
        
        return (
          <div
            key={provider.id}
            className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]"
          >
            {/* Provider Icon + Name */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="size-12 rounded-[12px] flex items-center justify-center"
                  style={{ backgroundColor: provider.bgColor }}
                >
                  {provider.icon}
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-[#181818] mb-1">
                    {provider.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] rounded-full text-[11px] font-semibold">
                      CONNECTED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Date */}
            <div className="flex items-center gap-2 text-[13px] text-[#767676] mb-4">
              <Clock className="size-4" />
              <span>Connected on {formatDate(account?.createdAt || '')}</span>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={() => handleUnlinkClick(provider.id)}
              className="w-full flex items-center justify-center gap-2 py-2 border border-[#ef4444] text-[#ef4444] rounded-[12px] font-semibold text-[14px] hover:bg-[#fef2f2] transition-colors"
            >
              <Unlink className="size-4" />
              Disconnect
            </button>
          </div>
        );
      })}
    </div>
  </div>
)}
```

### Connected Card Structure

**Card Style**:
- Background: rgba(252,252,252,0.95)
- Backdrop blur: 16px
- Border radius: 24px
- Border: #eee
- Padding: 24px (p-6)

**Elements**:
1. **Provider Icon Container**
   - Size: 48px × 48px
   - Background: Provider-specific bgColor
   - Border radius: 12px
   - Icon: 24px (size-6)

2. **Provider Name**
   - Font: 16px, semibold, #181818

3. **Connected Badge**
   - Background: #dcfce7 (light green)
   - Text: #16a34a (green)
   - Padding: px-2 py-0.5
   - Border radius: Full (pill)
   - Font: 11px, semibold, uppercase

4. **Connection Date**
   - Clock icon: 16px, #767676
   - Text: 13px, #767676
   - Format: "Connected on Jan 1, 2024"

5. **Disconnect Button**
   - Border: #ef4444 (red)
   - Text: #ef4444 (red)
   - Hover: #fef2f2 background
   - Unlink icon: 16px
   - Font: 14px, semibold

---

## Section 4: Available to Connect

**Visibility**: Only shown when there are unlinked providers (availableCount > 0)
**Location**: Left column, below connected accounts

```tsx
{availableCount > 0 && (
  <div>
    {/* Section Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-[20px] font-bold text-[#181818] mb-1">
          Available to Connect
        </h2>
        <p className="text-[14px] text-[#767676]">
          Link more accounts to enhance your experience
        </p>
      </div>
    </div>

    {/* Provider Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {providers.filter(provider => !isLinked(provider.id)).map((provider) => (
        <div
          key={provider.id}
          className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] transition-shadow"
        >
          {/* Provider Icon + Info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="size-12 rounded-[12px] flex items-center justify-center"
                style={{ backgroundColor: provider.bgColor }}
              >
                {provider.icon}
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[#181818] mb-1">
                  {provider.name}
                </p>
                <p className="text-[13px] text-[#767676]">
                  {provider.description}
                </p>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={() => onLink?.(provider.id)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#2563eb] text-white rounded-[12px] font-semibold text-[14px] hover:bg-[#1d4ed8] transition-colors"
          >
            <Link className="size-4" />
            Connect
          </button>
        </div>
      ))}
    </div>
  </div>
)}
```

### Available Card Structure

**Card Style**:
- Same as connected card
- Hover: Increased shadow (`0px_20px_40px_0px_rgba(0,0,0,0.08)`)
- Transition: shadow

**Elements**:
1. **Provider Icon** (same as connected)
2. **Provider Name** (16px, semibold)
3. **Description** (13px, #767676)
4. **Connect Button**:
   - Background: #2563eb (blue)
   - Text: White
   - Hover: #1d4ed8 (darker blue)
   - Link icon: 16px
   - Font: 14px, semibold

---

## Section 5: Right Sidebar (Sticky)

**Layout**: 1/4 width on desktop (lg:col-span-1)
**Sticky Position**: All cards together
**Top Offset**: 120px
**Gap**: 24px (space-y-6)

### Container Structure

```tsx
<div className="lg:col-span-1">
  <div className="sticky top-[120px] space-y-6">
    {/* Why Link Accounts? Card */}
    {/* Security Notice Card */}
    {/* Need Help? Card */}
  </div>
</div>
```

### 5.1 Why Link Accounts? Card

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-2 mb-4">
    <Shield className="size-5 text-[#2563eb]" />
    <h3 className="text-[18px] font-semibold text-[#181818]">
      Why Link Accounts?
    </h3>
  </div>
  
  <div className="space-y-4">
    {/* Benefit 1: Quick Sign In */}
    <div className="flex gap-3">
      <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
        <Zap className="size-4 text-[#2563eb]" />
      </div>
      <div>
        <p className="text-[15px] text-[#181818] font-semibold mb-1">
          Quick Sign In
        </p>
        <p className="text-[13px] text-[#767676]">
          Access your account with one click
        </p>
      </div>
    </div>

    {/* Benefit 2: Enhanced Security */}
    <div className="flex gap-3">
      <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
        <Lock className="size-4 text-[#2563eb]" />
      </div>
      <div>
        <p className="text-[15px] text-[#181818] font-semibold mb-1">
          Enhanced Security
        </p>
        <p className="text-[13px] text-[#767676]">
          Two-factor authentication support
        </p>
      </div>
    </div>

    {/* Benefit 3: Verified Identity */}
    <div className="flex gap-3">
      <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
        <Check className="size-4 text-[#2563eb]" />
      </div>
      <div>
        <p className="text-[15px] text-[#181818] font-semibold mb-1">
          Verified Identity
        </p>
        <p className="text-[13px] text-[#767676]">
          Build trust with verified accounts
        </p>
      </div>
    </div>
  </div>
</div>
```

**Benefits Listed**:
1. **Quick Sign In** (Zap icon)
   - Access with one click
2. **Enhanced Security** (Lock icon)
   - Two-factor authentication
3. **Verified Identity** (Check icon)
   - Build trust

### 5.2 Security Notice Card

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-2 mb-3">
    <Info className="size-5 text-[#767676]" />
    <h3 className="text-[16px] font-semibold text-[#181818]">
      Security Notice
    </h3>
  </div>
  
  <p className="text-[13px] text-[#767676] mb-4 leading-relaxed">
    We use industry-standard OAuth 2.0 to securely connect your accounts. 
    We never store your passwords.
  </p>
  
  <button className="w-full flex items-center justify-center gap-2 py-2 border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors">
    Learn More
    <ExternalLink className="size-4" />
  </button>
</div>
```

**Content**:
- OAuth 2.0 security message
- "We never store your passwords"
- "Learn More" link button

### 5.3 Need Help? Card

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-2 mb-3">
    <AlertCircle className="size-5 text-[#767676]" />
    <h3 className="text-[16px] font-semibold text-[#181818]">
      Need Help?
    </h3>
  </div>
  
  <p className="text-[13px] text-[#767676] mb-4">
    Having trouble linking accounts? Our support team is here to help.
  </p>
  
  <button className="w-full flex items-center justify-center gap-2 py-2 border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors">
    Contact Support
    <ChevronRight className="size-4" />
  </button>
</div>
```

---

## Section 6: Unlink Confirmation Modal

**Trigger**: When user clicks "Disconnect" button
**Purpose**: Prevent accidental unlinking
**Position**: Fixed, centered on screen
**Z-index**: 50

```tsx
{showUnlinkModal && providerToUnlink && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.98)] rounded-[24px] border border-[#eee] p-8 max-w-md w-full shadow-[0px_20px_60px_0px_rgba(0,0,0,0.3)]">
      <div className="text-center">
        {/* Warning Icon */}
        <div className="size-16 bg-[#fef3c7] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="size-8 text-[#f59e0b]" />
        </div>
        
        {/* Title */}
        <h3 className="text-[24px] font-bold text-[#181818] mb-2">
          Disconnect Account?
        </h3>
        
        {/* Message */}
        <p className="text-[15px] text-[#767676] mb-6">
          Are you sure you want to disconnect your {providerName} account? 
          You'll need to reconnect it to use it for sign in.
        </p>
        
        {/* Provider Display */}
        <div className="bg-[#f5f5f5] rounded-[16px] p-4 mb-6">
          <div className="flex items-center justify-center gap-3">
            {provider.icon}
            <p className="text-[16px] font-semibold text-[#181818]">
              {provider.name}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowUnlinkModal(false)}
            className="flex-1 bg-[#f5f5f5] text-[#181818] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#eee] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUnlinkConfirm}
            className="flex-1 bg-[#ef4444] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#dc2626] transition-colors flex items-center justify-center gap-2"
          >
            <Unlink className="size-4" />
            Disconnect
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

**Elements**:
1. **Backdrop**: Black/50 with blur
2. **Modal Container**: Centered, max-width 448px
3. **Warning Icon**: Orange circle with AlertTriangle
4. **Title**: "Disconnect Account?" (24px, bold)
5. **Message**: Confirmation text (15px)
6. **Provider Display**: Gray box with icon and name
7. **Buttons**:
   - Cancel: Gray background
   - Disconnect: Red background with Unlink icon

---

## Icons Used (lucide-react)

```javascript
import {
  Link,          // Connect button
  Unlink,        // Disconnect button & modal
  Check,         // Verified identity benefit
  X,             // Future use (close)
  Shield,        // Why link accounts header
  Info,          // Security notice
  AlertCircle,   // Need help
  ChevronRight,  // Contact support arrow
  ExternalLink,  // Learn more link
  Clock,         // Connection date
  Lock,          // Enhanced security benefit
  Zap,           // Quick sign in benefit
  AlertTriangle  // Unlink warning modal
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

### Provider Brand Colors

```typescript
const providerColors = {
  google: {
    primary: "#4285F4",
    bg: "#E8F0FE"
  },
  github: {
    primary: "#181717",
    bg: "#F6F8FA"
  },
  facebook: {
    primary: "#1877F2",
    bg: "#E7F3FF"
  },
  twitter: {
    primary: "#1DA1F2",
    bg: "#E8F5FD"
  },
  linkedin: {
    primary: "#0A66C2",
    bg: "#E7F3FF"
  },
  microsoft: {
    primary: "#00A4EF",
    bg: "#E7F3FF"
  }
};
```

### Status Colors

```css
/* Connected */
--connected-bg: #dcfce7;    /* Light green */
--connected-text: #16a34a;  /* Green */

/* Disconnect Button */
--disconnect-border: #ef4444;  /* Red */
--disconnect-text: #ef4444;    /* Red */
--disconnect-hover: #fef2f2;   /* Light red bg */

/* Warning (Unlink Modal) */
--warning-bg: #fef3c7;       /* Light orange */
--warning-icon: #f59e0b;     /* Orange */
```

### Card Shadows

```css
/* Default Card */
box-shadow: 0px 16px 35px 0px rgba(0, 0, 0, 0.04);

/* Card Hover (Available) */
box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.08);

/* Modal */
box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.3);
```

---

## State Management

### React State

```typescript
const [showUnlinkModal, setShowUnlinkModal] = useState(false);
const [providerToUnlink, setProviderToUnlink] = useState<string | null>(null);
```

### Helper Functions

```typescript
// Check if provider is linked
const isLinked = (providerId: string): boolean => {
  return linkedAccounts.some(account => account.provider === providerId);
};

// Get linked account details
const getLinkedAccount = (providerId: string): LinkedAccount | undefined => {
  return linkedAccounts.find(account => account.provider === providerId);
};

// Format connection date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  });
};

// Handle unlink click
const handleUnlinkClick = (provider: string): void => {
  setProviderToUnlink(provider);
  setShowUnlinkModal(true);
};

// Confirm unlink
const handleUnlinkConfirm = (): void => {
  if (providerToUnlink) {
    onUnlink?.(providerToUnlink);
    setShowUnlinkModal(false);
    setProviderToUnlink(null);
  }
};
```

### Computed Values

```typescript
const connectedCount = linkedAccounts.length;
const availableCount = providers.length - connectedCount;
```

### Props

```typescript
interface LinkedAccountsPageProps {
  onLink?: (provider: string) => void;
  onUnlink?: (provider: string) => void;
}
```

---

## API Integration

### Fetch Linked Accounts

```typescript
const fetchLinkedAccounts = async (): Promise<LinkedAccount[]> => {
  const response = await fetch('/api/user/accounts');
  if (!response.ok) throw new Error('Failed to fetch linked accounts');
  return await response.json();
};

// Usage with React Query
const { data: linkedAccounts, isLoading } = useQuery(
  ['linked-accounts'],
  fetchLinkedAccounts
);
```

### Link Account (NextAuth Flow)

```typescript
const handleLink = (provider: string): void => {
  // Redirect to NextAuth sign-in endpoint
  // NextAuth handles the OAuth flow automatically
  window.location.href = `/api/auth/signin/${provider}?callbackUrl=${window.location.href}`;
};

// Or with NextAuth's signIn function
import { signIn } from 'next-auth/react';

const handleLink = async (provider: string): Promise<void> => {
  await signIn(provider, {
    callbackUrl: window.location.href
  });
};
```

### Unlink Account

```typescript
const handleUnlink = async (provider: string): Promise<void> => {
  try {
    const response = await fetch(`/api/user/accounts/${provider}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to unlink account');
    }
    
    const data = await response.json();
    toast.success(data.message || 'Account unlinked successfully');
    
    // Refresh linked accounts
    queryClient.invalidateQueries(['linked-accounts']);
  } catch (error) {
    console.error('Unlink error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to unlink account');
  }
};
```

### Complete Integration Example

```typescript
function App() {
  const queryClient = useQueryClient();

  // Fetch linked accounts
  const { data: linkedAccounts = [], isLoading } = useQuery(
    ['linked-accounts'],
    fetchLinkedAccounts
  );

  // Link account mutation
  const linkMutation = useMutation(
    (provider: string) => signIn(provider, { callbackUrl: window.location.href }),
    {
      onSuccess: () => {
        // No need to do anything - page will redirect
      }
    }
  );

  // Unlink account mutation
  const unlinkMutation = useMutation(
    (provider: string) => 
      fetch(`/api/user/accounts/${provider}`, { method: 'DELETE' })
        .then(res => res.json()),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['linked-accounts']);
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error('Failed to unlink account');
      }
    }
  );

  return (
    <LinkedAccountsPage
      onLink={(provider) => linkMutation.mutate(provider)}
      onUnlink={(provider) => unlinkMutation.mutate(provider)}
    />
  );
}
```

---

## Responsive Breakpoints

### Mobile (< 640px)
```css
- Provider grid: 1 column
- Sidebar: Full width above main content
- Cards stack vertically
```

### Tablet (640px - 1024px)
```css
- Provider grid: 1-2 columns
- Sidebar: Full width above main content
- No sticky positioning
```

### Desktop (> 1024px)
```css
- Grid: 3/4 + 1/4 layout (grid-cols-4)
- Provider grid: 2 columns
- Sidebar: Sticky at top-[120px]
```

### Tailwind Breakpoint Classes

```tsx
// Grid Layout
className="grid grid-cols-1 lg:grid-cols-4 gap-8"

// Left Column
className="lg:col-span-3"

// Right Column
className="lg:col-span-1"

// Provider Grid
className="grid grid-cols-1 md:grid-cols-2 gap-4"

// Sticky Sidebar (desktop only)
className="sticky top-[120px] space-y-6"
```

---

## Accessibility

### ARIA Labels

```tsx
<button aria-label={`Connect ${provider.name} account`}>
  <Link /> Connect
</button>

<button aria-label={`Disconnect ${provider.name} account`}>
  <Unlink /> Disconnect
</button>

<div role="dialog" aria-labelledby="unlink-title" aria-describedby="unlink-description">
  <h3 id="unlink-title">Disconnect Account?</h3>
  <p id="unlink-description">Are you sure...</p>
</div>
```

### Keyboard Navigation

**Tab Order**:
1. Connected account cards
2. Disconnect buttons
3. Available provider cards
4. Connect buttons
5. Sidebar buttons
6. Modal buttons (when open)

**Keyboard Actions**:
- **Tab**: Navigate between elements
- **Space/Enter**: Activate buttons
- **Escape**: Close modal

### Screen Reader Support

```tsx
<div role="region" aria-labelledby="connected-heading">
  <h2 id="connected-heading">Connected Accounts</h2>
  {/* Connected cards */}
</div>

<div role="region" aria-labelledby="available-heading">
  <h2 id="available-heading">Available to Connect</h2>
  {/* Available cards */}
</div>
```

---

## Security Considerations

### OAuth Flow
- Uses NextAuth.js standard OAuth implementation
- Never stores provider passwords
- Access tokens stored securely server-side
- Refresh tokens encrypted in database

### Unlinking Protection
- Confirmation modal prevents accidental unlinking
- Backend validation ensures user has alternative auth method
- Cannot unlink last authentication method

### Best Practices
```typescript
// Backend validation example
async function unlinkAccount(userId: string, provider: string) {
  // Check if user has other auth methods
  const accounts = await db.account.findMany({
    where: { userId }
  });

  if (accounts.length === 1) {
    throw new Error('Cannot unlink last authentication method');
  }

  // Check if user has password set
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { password: true }
  });

  if (!user.password && accounts.length === 1) {
    throw new Error('Please set a password before unlinking your last social account');
  }

  // Safe to unlink
  await db.account.delete({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId: userId
      }
    }
  });
}
```

---

## Testing Checklist

### Visual Testing
- [ ] Provider icons display correctly with brand colors
- [ ] Connected badge shows on linked accounts
- [ ] Provider background colors match brand
- [ ] Disconnect button has red styling
- [ ] Connect button has blue styling
- [ ] Unlink modal displays correctly
- [ ] Sidebar cards sticky on desktop
- [ ] Mobile: Cards stack properly

### Functional Testing
- [ ] Connect button initiates OAuth flow
- [ ] OAuth callback links account successfully
- [ ] Disconnect button shows confirmation modal
- [ ] Modal cancel button works
- [ ] Modal disconnect button unlinks account
- [ ] Cannot unlink last auth method
- [ ] Connected count badge updates
- [ ] Page refreshes after link/unlink

### OAuth Flow Testing
- [ ] Google OAuth works
- [ ] GitHub OAuth works
- [ ] Facebook OAuth works
- [ ] Twitter OAuth works
- [ ] LinkedIn OAuth works
- [ ] Microsoft OAuth works
- [ ] OAuth errors handled gracefully
- [ ] Callback URL redirects correctly

### State Testing
- [ ] Connected accounts show in correct section
- [ ] Available accounts show in correct section
- [ ] Modal state managed correctly
- [ ] Provider to unlink tracked correctly

### API Integration Testing
- [ ] GET /api/user/accounts fetches data
- [ ] DELETE /api/user/accounts/{provider} unlinks
- [ ] Success responses handled
- [ ] Error responses handled
- [ ] Loading states display
- [ ] Error messages show

---

## Component Usage

### Import

```typescript
import { LinkedAccountsPage } from "@/app/components/linked-accounts-page";
```

### Basic Usage

```tsx
<LinkedAccountsPage
  onLink={(provider) => console.log('Link:', provider)}
  onUnlink={(provider) => console.log('Unlink:', provider)}
/>
```

### With NextAuth

```tsx
import { signIn } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function App() {
  const queryClient = useQueryClient();

  const { data: linkedAccounts } = useQuery(
    ['linked-accounts'],
    () => fetch('/api/user/accounts').then(res => res.json())
  );

  const handleLink = async (provider: string) => {
    await signIn(provider, {
      callbackUrl: window.location.href
    });
  };

  const unlinkMutation = useMutation(
    (provider: string) =>
      fetch(`/api/user/accounts/${provider}`, {
        method: 'DELETE'
      }).then(res => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['linked-accounts']);
      }
    }
  );

  return (
    <LinkedAccountsPage
      onLink={handleLink}
      onUnlink={(provider) => unlinkMutation.mutate(provider)}
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
    "react-dom": "^18.x.x",
    "next-auth": "^4.x.x"
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
  "@tanstack/react-query": "^4.x.x",  // For state management
  "sonner": "^1.x.x"                   // For toast notifications
}
```

---

## Browser Support

- **Chrome/Edge**: Full support (latest 2 versions)
- **Firefox**: Full support (latest 2 versions)
- **Safari**: Full support (latest 2 versions)
- **Mobile Safari**: Full support (iOS 14+)
- **Chrome Mobile**: Full support (Android 10+)

---

## Troubleshooting

### Common Issues

**1. OAuth callback not working**
```typescript
// Ensure callback URL is correctly configured
// In NextAuth config:
callbacks: {
  async signIn({ account, profile }) {
    // Link account logic
    return true;
  }
}
```

**2. Cannot unlink account**
```typescript
// Check if it's the last auth method
const accounts = await fetch('/api/user/accounts').then(r => r.json());
if (accounts.length === 1) {
  alert('Cannot unlink your only authentication method');
  return;
}
```

**3. Provider icons not showing**
```typescript
// Ensure SVG icons are properly imported
// Check console for errors
// Verify icon paths and fills
```

**4. Sticky sidebar not working**
```css
/* Ensure parent has proper height */
.parent-container {
  min-height: 100vh;
}

/* Check z-index */
.sticky-sidebar {
  position: sticky;
  top: 120px;
  z-index: 9;
}
```

---

## Future Enhancements

1. **Account Switching**: Quick switch between linked accounts
2. **Primary Account**: Set preferred sign-in method
3. **Connection History**: View when accounts were linked/unlinked
4. **Sync Settings**: Sync preferences across accounts
5. **Profile Merging**: Merge data from multiple accounts
6. **Email Notifications**: Notify when accounts are linked/unlinked
7. **Audit Log**: Track all account connection changes
8. **Batch Actions**: Link/unlink multiple accounts at once

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Component**: LinkedAccountsPage  
**Design System**: ProSupport Marketplace  
**Authentication**: NextAuth.js OAuth 2.0  
**API Endpoints**: `/api/user/accounts`, `/api/auth/signin/{provider}`
