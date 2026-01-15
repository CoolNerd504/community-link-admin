#!/usr/bin/env node

/**
 * Firebase Setup Validation Script
 * Run this script to validate your Firebase configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Firebase Configuration...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Please create .env.local file with your Firebase configuration.');
  console.log('📖 See FIREBASE_SETUP.md for detailed instructions.\n');
  
  console.log('Example .env.local content:');
  console.log(`
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
  `);
  process.exit(1);
}

// Read and validate .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let missingVars = [];
let hasPlaceholders = false;

requiredVars.forEach(varName => {
  if (!envContent.includes(varName)) {
    missingVars.push(varName);
  } else if (envContent.includes(`${varName}=your_`)) {
    hasPlaceholders = true;
    console.log(`⚠️  ${varName} has placeholder value`);
  }
});

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  process.exit(1);
}

if (hasPlaceholders) {
  console.log('\n⚠️  Please replace placeholder values with your actual Firebase configuration.');
  process.exit(1);
}

console.log('✅ All required Firebase environment variables are set!');
console.log('✅ .env.local file is properly configured.\n');

// Check if Firebase config file exists
const firebaseConfigPath = path.join(process.cwd(), 'lib', 'firebase-config.ts');
if (fs.existsSync(firebaseConfigPath)) {
  console.log('✅ Firebase configuration file exists');
} else {
  console.log('❌ Firebase configuration file missing');
  process.exit(1);
}

// Check if types file exists
const typesPath = path.join(process.cwd(), 'types', 'firebase-types.ts');
if (fs.existsSync(typesPath)) {
  console.log('✅ Firebase types file exists');
} else {
  console.log('❌ Firebase types file missing');
  process.exit(1);
}

console.log('\n🎉 Firebase setup validation complete!');
console.log('\nNext steps:');
console.log('1. Start development server: pnpm dev');
console.log('2. Test authentication in your browser');
console.log('3. Check Firebase Console for user data');
console.log('4. Deploy when ready: pnpm build && pnpm start\n');

console.log('📖 For detailed setup instructions, see FIREBASE_SETUP.md'); 