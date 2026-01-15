# ⚡ CommLink Quick Start Guide

## 🎯 Get Your App Running in 5 Minutes

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it: `connectpro-mvp`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Get Firebase Config
1. In Firebase Console, click the gear icon (⚙️) → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Add app" → "Web" (</>)
4. Register app: "CommLink Web"
5. Copy the config object

### Step 3: Create Environment File
Create `.env.local` in your project root:

```bash
# Firebase Configuration (replace with your values)
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

### Step 4: Enable Firebase Services
1. **Authentication**: Go to "Authentication" → "Get started"
   - Enable: Email/Password, Google
2. **Firestore**: Go to "Firestore Database" → "Create database"
   - Choose "Start in test mode"
3. **Storage**: Go to "Storage" → "Get started"
   - Choose "Start in test mode"

### Step 5: Validate Setup
```bash
pnpm validate
```

### Step 6: Start Development Server
```bash
pnpm dev
```

### Step 7: Test Your App
1. Open http://localhost:3000
2. Try signing up with email
3. Test Google sign-in
4. Explore the provider dashboard
5. Check admin panel

## 🚀 Ready to Deploy?

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

## 📚 Need More Details?

- **Firebase Setup**: See `FIREBASE_SETUP.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Features**: See `CommunityLink_Tasks.md`

## 🔧 Troubleshooting

**"Firebase App not initialized"**
- Check your `.env.local` file
- Verify all environment variables are set

**"Permission denied"**
- Go to Firestore → Rules
- Set to "Start in test mode" for development

**"Auth domain not authorized"**
- Go to Authentication → Settings
- Add `localhost` to authorized domains

---

**🎉 You're all set! Your CommLink app is ready to go!** 