# Privacy & Security Page - Complete Implementation Guide

## Overview

The Privacy & Security Page allows users to manage their account security settings, privacy preferences, and active sessions. Built following the ProSupport marketplace design language and structured around password management, two-factor authentication (2FA), privacy settings, and device management.

## Design Principles

- **Security First**: Clear emphasis on security best practices
- **User Control**: Easy toggles and settings
- **Visual Feedback**: Security score with circular progress
- **Clear Warnings**: Confirmation modals for sensitive actions
- **Active Monitoring**: Device session management
- **Consistent Design Language**: Matches all other ProSupport components
- **Smart Layout**: 3/4 + 1/4 grid with sticky sidebar

---

## API Payload Structure

### Two-Factor Authentication (2FA)

**Toggle 2FA**

**Endpoint**: `POST /api/auth/2fa`

**Request Payload**:
```typescript
{
  "enable": true
}
```

**Response Payload**:
```typescript
interface TwoFactorResponse {
  success: boolean;
  enabled: boolean;
  secret?: string;  // Only when enabling for setup
}
```

**Example Response**:
```json
{
  "success": true,
  "enabled": true,
  "secret": "JBSWY3DPEHPK3PXP"
}
```

### Password Management

**Change Password**

**Endpoint**: `POST /api/auth/change-password`

**Request Payload**:
```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
```

**Example**:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newStrongPassword!"
}
```

**Reset Password (Request)**

**Endpoint**: `POST /api/mobile/auth/forgot-password`

**Request Payload**:
```json
{
  "email": "user@example.com"
}
```

**Reset Password (Confirm)**

**Endpoint**: `POST /api/mobile/auth/reset-password`

**Request Payload**:
```json
{
  "token": "reset_token_string",
  "newPassword": "newStrongPassword!"
}
```

### Privacy Settings

**Endpoint**: `PATCH /api/user/profile/settings`

**Request Payload**:
```typescript
interface PrivacySettings {
  isOnline: boolean;  // Toggle online status visibility
  profileVisibility: "PUBLIC" | "PRIVATE" | "CONTACTS_ONLY";
}
```

**Example**:
```json
{
  "isOnline": false,
  "profileVisibility": "PRIVATE"
}
```

---

## Data Model (User Fields)

```prisma
model User {
  id               String
  email            String?
  password         String?    // Hashed
  pinHash          String?    // 6-digit PIN
  twoFactorEnabled Boolean    @default(false)
  phoneVerified    Boolean    @default(false)
  emailVerified    DateTime?
  
  profile          Profile?
  ...
}
```

---

## Layout Structure

### Grid System

```
Desktop (lg+):
┌────────────────────────────────────────────────────────────┐
│  Header (Sticky top-0, z-10)                               │
│  [Title + Security Score Badge]                            │
├─────────────────────────────────────────┬──────────────────┤
│  Left Column (3/4 width - Scrollable)   │  Right (1/4)     │
│                                          │                  │
│  ┌────────────────────────────────────┐ │  ┌────────────┐ │
│  │ Password & Authentication          │ │  │ Security   │ │
│  │ • Change Password                  │ │  │ Score      │ │
│  │ • Two-Factor Authentication        │ │  │            │ │
│  │ • Email Verification               │ │  │ Sticky!    │ │
│  │ • Phone Verification               │ │  │ top-120px  │ │
│  └────────────────────────────────────┘ │  │            │ │
│                                          │  │ 100%       │ │
│  ┌────────────────────────────────────┐ │  │ Progress   │ │
│  │ Privacy Settings                   │ │  └────────────┘ │
│  │ • Show Online Status (Toggle)      │ │                  │
│  │ • Profile Visibility               │ │  ┌────────────┐ │
│  │   [Public | Contacts | Private]    │ │  │ Security   │ │
│  └────────────────────────────────────┘ │  │ Tips       │ │
│                                          │  │            │ │
│  ┌────────────────────────────────────┐ │  │ Sticky!    │ │
│  │ Active Sessions                    │ │  └────────────┘ │
│  │ • MacBook Pro (Current)            │ │                  │
│  │ • iPhone 15 Pro                    │ │  ┌────────────┐ │
│  │ • Windows PC                       │ │  │ Need Help? │ │
│  │ • End Session buttons              │ │  │            │ │
│  └────────────────────────────────────┘ │  │ Sticky!    │ │
└─────────────────────────────────────────┴──────────────────┘
```

---

## Component Structure

### File Location
```
/src/app/components/privacy-security-page.tsx
```

### TypeScript Interfaces

```typescript
// API Interfaces
interface TwoFactorResponse {
  success: boolean;
  enabled: boolean;
  secret?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface PrivacySettings {
  isOnline: boolean;
  profileVisibility: "PUBLIC" | "PRIVATE" | "CONTACTS_ONLY";
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

// Component Props
interface PrivacySecurityPageProps {
  onChangePassword?: (data: ChangePasswordRequest) => void;
  onToggle2FA?: (enable: boolean) => void;
  onUpdatePrivacy?: (settings: PrivacySettings) => void;
  onEndSession?: (sessionId: string) => void;
}
```

---

## Section 1: Header (Sticky)

**Position**: Sticky at top (z-index: 10)
**Background**: White with bottom border

```tsx
<div className="bg-white border-b border-[#eee] sticky top-0 z-10">
  <div className="max-w-[1400px] mx-auto px-8 py-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-[28px] font-bold text-[#181818] mb-1">
          Privacy & Security
        </h1>
        <p className="text-[15px] text-[#767676]">
          Manage your account security and privacy preferences
        </p>
      </div>
      
      {/* Security Score Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] rounded-[12px]">
          <ShieldCheck className={`size-4 ${
            securityScore >= 80 ? 'text-[#16a34a]' : 'text-[#f59e0b]'
          }`} />
          <span className="text-[14px] font-semibold text-[#181818]">
            Security: {securityScore}%
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Security Score Calculation**:
```typescript
const securityScore = 
  twoFactorEnabled && phoneVerified && emailVerified ? 100 : 
  (twoFactorEnabled ? 80 : (phoneVerified && emailVerified ? 60 : 40));
```

**Score Colors**:
- 80-100%: Green (#16a34a)
- 60-79%: Orange (#f59e0b)
- 0-59%: Red (#ef4444)

---

## Section 2: Password & Authentication

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-2 mb-6">
    <Lock className="size-5 text-[#2563eb]" />
    <h2 className="text-[20px] font-bold text-[#181818]">
      Password & Authentication
    </h2>
  </div>

  <div className="space-y-4">
    {/* Change Password */}
    <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px]">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
          <Key className="size-5 text-[#2563eb]" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#181818] mb-1">Password</p>
          <p className="text-[13px] text-[#767676]">Last changed 3 months ago</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-[#2563eb] text-white rounded-[12px] font-semibold text-[14px] hover:bg-[#1d4ed8]">
        Change Password
      </button>
    </div>

    {/* Two-Factor Authentication */}
    <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px]">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
          <Smartphone className="size-5 text-[#2563eb]" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#181818] mb-1">
            Two-Factor Authentication
          </p>
          <p className="text-[13px] text-[#767676]">
            {twoFactorEnabled ? "Extra security enabled" : "Add an extra layer of security"}
          </p>
        </div>
      </div>
      <button className={`px-4 py-2 rounded-[12px] font-semibold text-[14px] ${
        twoFactorEnabled
          ? "border border-[#ef4444] text-[#ef4444] hover:bg-[#fef2f2]"
          : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
      }`}>
        {twoFactorEnabled ? "Disable" : "Enable"}
      </button>
    </div>

    {/* Verification Status */}
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-[#f5f5f5] rounded-[16px]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[14px] font-semibold text-[#181818]">
            Email Verification
          </p>
          {emailVerified ? (
            <Check className="size-5 text-[#16a34a]" />
          ) : (
            <X className="size-5 text-[#ef4444]" />
          )}
        </div>
        <p className="text-[13px] text-[#767676]">
          {emailVerified ? "Verified" : "Not verified"}
        </p>
      </div>

      <div className="p-4 bg-[#f5f5f5] rounded-[16px]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[14px] font-semibold text-[#181818]">
            Phone Verification
          </p>
          {phoneVerified ? (
            <Check className="size-5 text-[#16a34a]" />
          ) : (
            <X className="size-5 text-[#ef4444]" />
          )}
        </div>
        <p className="text-[13px] text-[#767676]">
          {phoneVerified ? "Verified" : "Not verified"}
        </p>
      </div>
    </div>
  </div>
</div>
```

---

## Section 3: Privacy Settings

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-2 mb-6">
    <Eye className="size-5 text-[#2563eb]" />
    <h2 className="text-[20px] font-bold text-[#181818]">Privacy Settings</h2>
  </div>

  <div className="space-y-4">
    {/* Online Status Toggle */}
    <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px]">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
          <Globe className="size-5 text-[#2563eb]" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#181818] mb-1">
            Show Online Status
          </p>
          <p className="text-[13px] text-[#767676]">
            Let others see when you're online
          </p>
        </div>
      </div>
      
      {/* Toggle Switch */}
      <button
        onClick={() => handlePrivacyUpdate('isOnline', !isOnline)}
        className={`relative w-14 h-8 rounded-full transition-colors ${
          isOnline ? 'bg-[#16a34a]' : 'bg-[#d1d5db]'
        }`}
      >
        <span className={`absolute top-1 left-1 size-6 bg-white rounded-full transition-transform ${
          isOnline ? 'translate-x-6' : ''
        }`} />
      </button>
    </div>

    {/* Profile Visibility */}
    <div className="p-4 bg-[#f5f5f5] rounded-[16px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
          <Users className="size-5 text-[#2563eb]" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#181818] mb-1">
            Profile Visibility
          </p>
          <p className="text-[13px] text-[#767676]">
            Control who can see your profile
          </p>
        </div>
      </div>

      {/* Visibility Options */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handlePrivacyUpdate('profileVisibility', 'PUBLIC')}
          className={`p-3 rounded-[12px] border-2 transition-all ${
            profileVisibility === 'PUBLIC'
              ? 'border-[#2563eb] bg-[#f0f4ff]'
              : 'border-[#eee] hover:border-[#2563eb]'
          }`}
        >
          <Globe className={`size-5 mx-auto mb-2 ${
            profileVisibility === 'PUBLIC' ? 'text-[#2563eb]' : 'text-[#767676]'
          }`} />
          <p className="text-[13px] font-semibold text-[#181818]">Public</p>
        </button>

        <button
          onClick={() => handlePrivacyUpdate('profileVisibility', 'CONTACTS_ONLY')}
          className={/* Same structure */}
        >
          <UserCheck className={/* Icon styling */} />
          <p className="text-[13px] font-semibold text-[#181818]">Contacts</p>
        </button>

        <button
          onClick={() => handlePrivacyUpdate('profileVisibility', 'PRIVATE')}
          className={/* Same structure */}
        >
          <Lock className={/* Icon styling */} />
          <p className="text-[13px] font-semibold text-[#181818]">Private</p>
        </button>
      </div>
    </div>
  </div>
</div>
```

### Toggle Switch Component

**Design**:
- Width: 56px (w-14)
- Height: 32px (h-8)
- Active: Green (#16a34a)
- Inactive: Gray (#d1d5db)
- Circle: 24px, white, smooth transition

---

## Section 4: Active Sessions

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      <Laptop className="size-5 text-[#2563eb]" />
      <h2 className="text-[20px] font-bold text-[#181818]">Active Sessions</h2>
    </div>
    <button className="flex items-center gap-2 px-3 py-2 border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[13px] hover:bg-[#f5f5f5]">
      <LogOut className="size-4" />
      End All
    </button>
  </div>

  <div className="space-y-3">
    {activeSessions.map((session) => (
      <div key={session.id} className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px]">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
            <Laptop className="size-5 text-[#2563eb]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[15px] font-semibold text-[#181818]">
                {session.device}
              </p>
              {session.isCurrent && (
                <span className="px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] rounded-full text-[11px] font-semibold">
                  CURRENT
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[13px] text-[#767676]">
              <span>{session.browser}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {session.location}
              </span>
              <span>•</span>
              <span>{session.lastActive}</span>
            </div>
          </div>
        </div>
        
        {!session.isCurrent && (
          <button
            onClick={() => onEndSession?.(session.id)}
            className="px-3 py-2 border border-[#ef4444] text-[#ef4444] rounded-[12px] font-semibold text-[13px] hover:bg-[#fef2f2]"
          >
            End Session
          </button>
        )}
      </div>
    ))}
  </div>
</div>
```

---

## Section 5: Right Sidebar (Sticky)

### 5.1 Security Score Card

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-2 mb-4">
    <Shield className="size-5 text-[#2563eb]" />
    <h3 className="text-[18px] font-semibold text-[#181818]">Security Score</h3>
  </div>
  
  {/* Circular Progress */}
  <div className="relative size-32 mx-auto mb-4">
    <svg className="transform -rotate-90" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="#eee"
        strokeWidth="8"
      />
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke={securityScore >= 80 ? "#16a34a" : securityScore >= 60 ? "#f59e0b" : "#ef4444"}
        strokeWidth="8"
        strokeDasharray={`${(securityScore / 100) * 339.292} 339.292`}
        strokeLinecap="round"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-[32px] font-bold text-[#181818]">{securityScore}%</span>
    </div>
  </div>

  {/* Checklist */}
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-[13px]">
      {twoFactorEnabled ? (
        <Check className="size-4 text-[#16a34a]" />
      ) : (
        <X className="size-4 text-[#ef4444]" />
      )}
      <span className="text-[#767676]">Two-factor authentication</span>
    </div>
    <div className="flex items-center gap-2 text-[13px]">
      {phoneVerified ? (
        <Check className="size-4 text-[#16a34a]" />
      ) : (
        <X className="size-4 text-[#ef4444]" />
      )}
      <span className="text-[#767676]">Phone verified</span>
    </div>
    <div className="flex items-center gap-2 text-[13px]">
      {emailVerified ? (
        <Check className="size-4 text-[#16a34a]" />
      ) : (
        <X className="size-4 text-[#ef4444]" />
      )}
      <span className="text-[#767676]">Email verified</span>
    </div>
  </div>
</div>
```

**Circular Progress Calculation**:
```typescript
// Circle radius: 54
// Circumference: 2 * π * r = 339.292
const dasharray = `${(securityScore / 100) * 339.292} 339.292`;
```

### 5.2 Security Tips Card

```tsx
<div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-2 mb-4">
    <Info className="size-5 text-[#2563eb]" />
    <h3 className="text-[18px] font-semibold text-[#181818]">Security Tips</h3>
  </div>
  
  <div className="space-y-4">
    <div className="flex gap-3">
      <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
        <Zap className="size-4 text-[#2563eb]" />
      </div>
      <div>
        <p className="text-[15px] text-[#181818] font-semibold mb-1">Strong Password</p>
        <p className="text-[13px] text-[#767676]">Use at least 12 characters</p>
      </div>
    </div>
    
    <div className="flex gap-3">
      <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
        <RefreshCw className="size-4 text-[#2563eb]" />
      </div>
      <div>
        <p className="text-[15px] text-[#181818] font-semibold mb-1">Regular Updates</p>
        <p className="text-[13px] text-[#767676]">Change password every 90 days</p>
      </div>
    </div>
    
    <div className="flex gap-3">
      <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
        <ShieldCheck className="size-4 text-[#2563eb]" />
      </div>
      <div>
        <p className="text-[15px] text-[#181818] font-semibold mb-1">Enable 2FA</p>
        <p className="text-[13px] text-[#767676]">Add extra layer of security</p>
      </div>
    </div>
  </div>
</div>
```

---

## Section 6: Modals

### 6.1 Change Password Modal

```tsx
{showPasswordModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.98)] rounded-[24px] border border-[#eee] p-8 max-w-md w-full shadow-[0px_20px_60px_0px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[24px] font-bold text-[#181818]">Change Password</h3>
        <button
          onClick={() => setShowPasswordModal(false)}
          className="size-8 flex items-center justify-center rounded-[8px] hover:bg-[#f5f5f5]"
        >
          <X className="size-5 text-[#767676]" />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {/* Current Password */}
        <div>
          <label className="block text-[14px] font-semibold text-[#181818] mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-[#eee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#2563eb]"
              placeholder="Enter current password"
            />
            <button
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showCurrentPassword ? (
                <EyeOff className="size-5 text-[#767676]" />
              ) : (
                <Eye className="size-5 text-[#767676]" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[14px] font-semibold text-[#181818] mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-[#eee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#2563eb]"
              placeholder="Enter new password"
            />
            <button
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showNewPassword ? (
                <EyeOff className="size-5 text-[#767676]" />
              ) : (
                <Eye className="size-5 text-[#767676]" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-[14px] font-semibold text-[#181818] mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[#eee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#2563eb]"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowPasswordModal(false)}
          className="flex-1 bg-[#f5f5f5] text-[#181818] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#eee]"
        >
          Cancel
        </button>
        <button
          onClick={handlePasswordChange}
          className="flex-1 bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8]"
        >
          Update Password
        </button>
      </div>
    </div>
  </div>
)}
```

### 6.2 Enable 2FA Modal

```tsx
{show2FAModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.98)] rounded-[24px] border border-[#eee] p-8 max-w-md w-full shadow-[0px_20px_60px_0px_rgba(0,0,0,0.3)]">
      <div className="text-center">
        <div className="size-16 bg-[#f0f4ff] rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="size-8 text-[#2563eb]" />
        </div>
        
        <h3 className="text-[24px] font-bold text-[#181818] mb-2">
          Enable Two-Factor Authentication
        </h3>
        
        <p className="text-[15px] text-[#767676] mb-6">
          Scan this QR code with your authenticator app to set up 2FA.
        </p>
        
        <div className="bg-[#f5f5f5] rounded-[16px] p-6 mb-6">
          <div className="size-48 mx-auto bg-white rounded-[12px] flex items-center justify-center">
            <p className="text-[13px] text-[#767676]">[QR CODE]</p>
          </div>
          <p className="text-[12px] font-mono text-[#767676] mt-3">
            JBSWY3DPEHPK3PXP
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShow2FAModal(false)}
            className="flex-1 bg-[#f5f5f5] text-[#181818] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#eee]"
          >
            Cancel
          </button>
          <button
            onClick={handleEnable2FA}
            className="flex-1 bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8]"
          >
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

### 6.3 Disable 2FA Confirmation Modal

```tsx
{showDisable2FAModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.98)] rounded-[24px] border border-[#eee] p-8 max-w-md w-full shadow-[0px_20px_60px_0px_rgba(0,0,0,0.3)]">
      <div className="text-center">
        <div className="size-16 bg-[#fef3c7] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="size-8 text-[#f59e0b]" />
        </div>
        
        <h3 className="text-[24px] font-bold text-[#181818] mb-2">
          Disable 2FA?
        </h3>
        
        <p className="text-[15px] text-[#767676] mb-6">
          This will reduce your account security. Are you sure you want to disable two-factor authentication?
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowDisable2FAModal(false)}
            className="flex-1 bg-[#f5f5f5] text-[#181818] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#eee]"
          >
            Cancel
          </button>
          <button
            onClick={handleDisable2FA}
            className="flex-1 bg-[#ef4444] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#dc2626]"
          >
            Disable 2FA
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

---

## Icons Used (lucide-react)

```javascript
import {
  Shield,        // Security score, main icon
  Lock,          // Password, private visibility
  Eye,           // Show password, privacy
  EyeOff,        // Hide password
  Key,           // Password icon
  Smartphone,    // 2FA, mobile device
  Check,         // Verified status
  X,             // Not verified, close
  AlertCircle,   // Need help
  ChevronRight,  // Contact support arrow
  Info,          // Security tips
  Clock,         // Last changed time
  Globe,         // Public visibility, online status
  Users,         // Contacts visibility
  UserCheck,     // Contacts icon
  Laptop,        // Active sessions
  MapPin,        // Location
  LogOut,        // End session
  AlertTriangle, // Warning (disable 2FA)
  RefreshCw,     // Regular updates tip
  Zap,           // Strong password tip
  ShieldCheck    // Security badge, enable 2FA tip
} from "lucide-react";
```

---

## State Management

```typescript
// Modal States
const [showPasswordModal, setShowPasswordModal] = useState(false);
const [show2FAModal, setShow2FAModal] = useState(false);
const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);

// Form States
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);

// User Settings
const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
const [phoneVerified, setPhoneVerified] = useState(true);
const [emailVerified, setEmailVerified] = useState(true);
const [isOnline, setIsOnline] = useState(true);
const [profileVisibility, setProfileVisibility] = useState<"PUBLIC" | "PRIVATE" | "CONTACTS_ONLY">("PUBLIC");
```

---

## API Integration

### Change Password

```typescript
const handlePasswordChange = async () => {
  if (newPassword !== confirmPassword) {
    toast.error("Passwords don't match!");
    return;
  }

  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    if (!response.ok) throw new Error('Password change failed');

    toast.success('Password updated successfully');
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    toast.error('Failed to change password');
  }
};
```

### Toggle 2FA

```typescript
const handleToggle2FA = async (enable: boolean) => {
  try {
    const response = await fetch('/api/auth/2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enable })
    });

    const data: TwoFactorResponse = await response.json();

    if (data.success) {
      setTwoFactorEnabled(data.enabled);
      
      if (data.enabled && data.secret) {
        // Show QR code with secret
        setShow2FAModal(true);
      } else {
        toast.success(data.enabled ? '2FA enabled' : '2FA disabled');
      }
    }
  } catch (error) {
    toast.error('Failed to toggle 2FA');
  }
};
```

### Update Privacy Settings

```typescript
const handlePrivacyUpdate = async (
  key: keyof PrivacySettings,
  value: any
) => {
  const newSettings: PrivacySettings = {
    isOnline: key === 'isOnline' ? value : isOnline,
    profileVisibility: key === 'profileVisibility' ? value : profileVisibility
  };

  try {
    const response = await fetch('/api/user/profile/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });

    if (!response.ok) throw new Error('Update failed');

    if (key === 'isOnline') setIsOnline(value);
    if (key === 'profileVisibility') setProfileVisibility(value);

    toast.success('Privacy settings updated');
  } catch (error) {
    toast.error('Failed to update settings');
  }
};
```

### End Session

```typescript
const handleEndSession = async (sessionId: string) => {
  try {
    const response = await fetch(`/api/user/sessions/${sessionId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to end session');

    toast.success('Session ended successfully');
    // Refresh sessions list
    refetchSessions();
  } catch (error) {
    toast.error('Failed to end session');
  }
};
```

---

## Component Usage

```tsx
import { PrivacySecurityPage } from "@/app/components/privacy-security-page";

function App() {
  return (
    <PrivacySecurityPage
      onChangePassword={async (data) => {
        // Handle password change
      }}
      onToggle2FA={async (enable) => {
        // Handle 2FA toggle
      }}
      onUpdatePrivacy={async (settings) => {
        // Handle privacy update
      }}
      onEndSession={async (sessionId) => {
        // Handle end session
      }}
    />
  );
}
```

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Component**: PrivacySecurityPage  
**Design System**: ProSupport Marketplace  
**API Endpoints**: `/api/auth/2fa`, `/api/auth/change-password`, `/api/user/profile/settings`
