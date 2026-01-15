# 🔥 Firebase Setup Guide for CommLink

## 📋 Prerequisites
- Firebase account (free tier is sufficient for MVP)
- Google Cloud Console access

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `connectpro-mvp` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Choose analytics account or create new one
6. Click "Create project"

## 🔧 Step 2: Configure Firebase Services

### Authentication Setup
1. In Firebase Console, go to "Authentication" → "Get started"
2. Enable these sign-in methods:
   - **Email/Password** ✅
   - **Google** ✅
   - **Phone** ✅ (requires verification)
3. Add your domain to authorized domains (for production)

### Firestore Database Setup
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (we'll add security rules later)
3. Select location closest to your users
4. Click "Done"

### Storage Setup (for profile images)
1. Go to "Storage" → "Get started"
2. Choose "Start in test mode"
3. Select location (same as Firestore)

## 🔑 Step 3: Get Configuration Values

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → "Web" (</>)
4. Register app with name: "CommLink Web"
5. Copy the configuration object

## 📝 Step 4: Create Environment File

Create a `.env.local` file in your project root with:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_NAME=CommLink
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🔒 Step 5: Security Rules (Optional for MVP)

### Firestore Security Rules
Go to Firestore → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ===== ALL AUTHENTICATED USERS CAN ACCESS =====
    
    // Categories - any authenticated user can manage
    match /categories/{categoryId} {
      allow read, write: if request.auth != null;
    }
    
    // Pricing tiers - any authenticated user can manage
    match /pricingTiers/{tierId} {
      allow read, write: if request.auth != null;
    }
    
    // Provider tier assignments - any authenticated user can manage
    match /providerTierAssignments/{assignmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Admin provider actions - any authenticated user can manage
    match /adminProviderActions/{actionId} {
      allow read, write: if request.auth != null;
    }
    
    // Admin group actions - any authenticated user can manage
    match /adminGroupActions/{actionId} {
      allow read, write: if request.auth != null;
    }
    
    // System configuration - any authenticated user can manage
    match /systemConfig/{configId} {
      allow read, write: if request.auth != null;
    }
    
    // Audit logs - any authenticated user can read/write
    match /auditLogs/{logId} {
      allow read, write: if request.auth != null;
    }
    
    // Platform analytics - any authenticated user can read/write
    match /platformAnalytics/{analyticsId} {
      allow read, write: if request.auth != null;
    }
    
    // ===== USER-ACCESSIBLE COLLECTIONS =====
    
    // Users - users can read their own data, any authenticated user can read all
    // ADMINS can update any user's data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.uid == userId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin'
      );
    }
    
    // Sessions - users can read their own sessions, any authenticated user can read all
    match /sessions/{sessionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.uid == resource.data.clientId || 
        request.auth.uid == resource.data.providerId
      );
    }
    
    // Groups - authenticated users can read, group owners can write
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.uid == resource.data.createdBy
      );
    }
    
    // Group members - authenticated users can read, group owners can write
    match /groupMembers/{memberId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.uid == resource.data.userId
      );
    }
    
    // Reviews - authenticated users can read all, authors can write their own
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.uid == resource.data.clientId
      );
    }
    
    // Chat rooms - participants can read/write
    match /chatRooms/{roomId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Chat messages - participants can read/write
    match /chatMessages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/chatRooms/$(resource.data.roomId)).data.participants;
    }
    
    // Time bundles - users can manage their own bundles
    match /timeBundles/{bundleId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Bundle purchases - users can read their own purchases
    match /bundlePurchases/{purchaseId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Bundle usage - users can read their own usage
    match /bundleUsage/{usageId} {
      allow read: if request.auth != null && 
        request.auth.uid == get(/databases/$(database)/documents/timeBundles/$(resource.data.bundleId)).data.userId;
    }
    
    // Notifications - users can read their own notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Payments - users can read their own payments
    match /payments/{paymentId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.clientId || 
        request.auth.uid == resource.data.providerId
      );
    }
    
    // Disputes - participants can read/write
    match /disputes/{disputeId} {
      allow read, write: if request.auth != null && (
        request.auth.uid == resource.data.clientId || 
        request.auth.uid == resource.data.providerId
      );
    }
    
    // Sponsored listings - providers can manage their own
    match /sponsoredListings/{listingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.providerId;
    }
    
    // User analytics - users can read their own
    match /userAnalytics/{analyticsId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // ===== DEFAULT RULE =====
    
    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Storage Security Rules
Go to Storage → Rules and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload their own profile images
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access to profile images
    match /users/{userId}/profile.jpg {
      allow read: if true;
    }
  }
}
```

## 🧪 Step 6: Test Configuration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Test authentication:
   - Try signing up with email
   - Try Google sign-in
   - Check if user data is saved to Firestore

3. Test provider features:
   - Create a provider profile
   - Check if data appears in Firestore

## 🚀 Step 7: Deploy to Production

### Option A: Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Option B: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `pnpm build`
5. Deploy: `firebase deploy`

## 🔍 Troubleshooting

### Common Issues:
1. **"Firebase App not initialized"** - Check environment variables
2. **"Permission denied"** - Check Firestore security rules
3. **"Auth domain not authorized"** - Add domain to Firebase Auth settings

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Check Firebase Console for authentication logs
4. Verify Firestore rules are published

## 📞 Support

If you encounter issues:
1. Check Firebase Console logs
2. Review browser console errors
3. Verify all environment variables are set correctly
4. Test with a fresh Firebase project

---

**🎯 Your CommLink app is now ready to connect to Firebase!** 