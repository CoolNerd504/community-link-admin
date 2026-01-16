# Comprehensive Mobile Implementation Guide & API Schema

This document details the exact API contracts, logical flows, and edge cases for the CommLink Mobile Application. Developers should follow these schemas strictly.

---

## 🔐 1. Authentication & Onboarding

### A. Register User (Mobile - JWT Token)
**Intent:** Create a new account and receive JWT token.
**Endpoint:** `POST /api/mobile/auth/register`

> [!NOTE]
> **Mobile-Optimized**: Returns JWT token immediately upon successful registration, eliminating the need for a separate login call.

#### Scenario 1: Successful Registration (Client)
**Request Payload:**
```json
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "password": "SecurePassword1!", // Must be >8 chars, 1 Upper, 1 Special
  "role": "USER",
  "username": "s_connor", // Alphanumeric, 3-20 chars
  "phoneNumber": "0971112222",
  "pin": "123456" // Exactly 6 digits
}
```
**Response (201 Created):**
```json
{
  "user": {
    "id": "cm3uuid-string-123",
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "role": "USER",
    "username": "s_connor",
    "kycStatus": "PENDING",
    "image": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires": "2026-02-14T10:00:00.000Z"
}
```

**Usage:**
1. Store `token` in `AsyncStorage` or secure storage.
2. Include in all subsequent requests: `Authorization: Bearer <token>`

#### Scenario 2: Validation Failure (Invalid PIN)
**Request Payload:** `{"pin": "123"}` (Too short)
**Response (400 Bad Request):**
```json
{
  "message": "PIN must be exactly 6 digits"
}
```

#### Scenario 3: Conflict (Duplicate Data)
**Request Payload:** Existing email, username, or phone.
**Response (409 Conflict):**
```json
{
  "message": "Email already registered"
}
```

---

### B. Login (Mobile - JWT Token)
**Intent:** Authenticate and retrieve JWT token for mobile apps.
**Endpoint:** `POST /api/mobile/auth/login`

> [!NOTE]
> **Mobile-Optimized**: This endpoint returns a JWT token in the response body, eliminating the need for cookie management in React Native apps.

#### Scenario 1: Success
**Request Payload:**
```json
{
  "email": "sarah@example.com",
  "password": "SecurePassword1!"
}
```
**Response (200 OK):**
```json
{
  "user": {
    "id": "cm3uuid-string-123",
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "role": "USER",
    "username": "s_connor",
    "kycStatus": "PENDING",
    "image": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires": "2026-02-14T10:00:00.000Z"
}
```

**Usage:**
1. Store `token` in `AsyncStorage` or secure storage.
2. Include in all subsequent requests: `Authorization: Bearer <token>`

#### Scenario 2: Invalid Credentials
**Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
```

---

### C. Login (Web - Cookie-Based)
**Intent:** Authenticate via NextAuth for web browsers.
**Pre-requisite:** Fetch CSRF token first.
1. **Endpoint:** `GET /api/auth/csrf`
2. **Response:** `{"csrfToken": "e580..."}`

**Endpoint:** `POST /api/auth/callback/credentials`

**Request Payload:**
```json
{
  "email": "sarah@example.com",
  "password": "SecurePassword1!",
  "csrfToken": "e580...",
  "redirect": false
}
```
**Response (200 OK):**
```json
{
  "user": { "id": "...", "name": "...", "role": "..." },
  "expires": "2026-02-14T10:00:00.000Z"
}
```
> [!IMPORTANT]
> **Session Management**: Web authentication uses **HttpOnly Cookies** (`authjs.session-token`). The JSON response does NOT contain a token string.

---

## 🔍 2. Discovery (Search Providers)
**Intent:** Find service providers based on criteria.
**Endpoint:** `GET /api/providers/search`

#### Scenario 1: Filtered Search
**Request:** `GET /api/providers/search?q=Plumber&category=Maintenance&minPrice=100`

**Response (200 OK):**
```json
[
  {
    "id": "prov-001",
    "name": "Mario Bros",
    "image": "https://s3.bucket/mario.jpg",
    "rating": 4.9,
    "reviewCount": 150,
    "profile": {
      "headline": "Expert Plumbing & Heating",
      "location": "Lusaka",
      "isVerified": true
    },
    "services": [
      {
        "id": "svc-101",
        "title": "Pipe Repair",
        "price": 500,
        "duration": 60,
        "category": "Maintenance"
      }
    ]
  }
]
```

#### Scenario 2: No Results
**Response (200 OK):** `[]` (Empty Array) - *Mobile App should handle this by showing "No providers found" illustration.*

---

## 🛠 3. Service Management (Provider)
**Intent:** Provider adds a new service offering.
**Endpoint:** `POST /api/services`

#### Scenario 1: Create Service Successfully
**Request Payload:**
```json
{
  "title": "Full House Cleaning",
  "description": "Deep cleaning of up to 3 bedrooms including windows.",
  "price": 450.00,
  "duration": 120, // Minutes
  "category": "Home Services"
}
```
**Response (201 Created):**
```json
{
  "id": "svc-new-123",
  "providerId": "prov-001",
  "title": "Full House Cleaning",
  "isActive": true,
  "createdAt": "2026-01-16T10:00:00.000Z"
}
```

#### Scenario 2: Validation Error (Missing Desc)
**Request:** `{"title": "Test"}`
**Response (400 Bad Request):** `{"message": "Description is required"}`

---

## 📅 4. Booking Flow

### A. Create Request (Client)
**Intent:** Client requests a session.
**Endpoint:** `POST /api/bookings`

#### Scenario 1: Schedule a Session
**Request Payload:**
```json
{
  "providerId": "prov-001",
  "serviceId": "svc-101",
  "date": "2026-01-20T14:00:00Z", // ISO Date
  "notes": "Gate code is 1234. Please bring own tools."
}
```
**Response (201 Created):**
```json
{
  "id": "bk-789",
  "status": "PENDING",
  "service": { "title": "Pipe Repair" },
  "client": { "name": "Sarah Connor" }
}
```

### B. Respond to Request (Provider)
**Intent:** Provider Accepts or Declines.
**Endpoint:** `POST /api/bookings/{id}/respond`

#### Scenario 1: Accept
**Request Payload:**
```json
{
  "status": "accepted" // Case sensitive enum: 'accepted', 'declined'
}
```
**Response (200 OK):**
```json
{
  "id": "bk-789",
  "status": "ACCEPTED",
  "updatedAt": "..."
}
```

---

## 💰 5. Wallet & Payouts (Provider)

### A. Request Payout
**Intent:** Withdraw earnings to bank/mobile money.
**Endpoint:** `POST /api/wallet/payout`

#### Scenario 1: Successful Request
**Pre-condition:** Balance >= Amount.
**Request Payload:**
```json
{
  "amount": 500.00,
  "bankDetails": "Airtel Money: 097-xxx-xxxx"
}
```
**Response (200 OK):**
```json
{
  "id": "payout-001",
  "amount": 500.00,
  "status": "PENDING",
  "message": "Payout request submitted."
}
```

#### Scenario 2: Insufficient Funds
**Request:** Amount = 5000 (Balance = 100).
**Response (400 Bad Request):**
```json
{
  "message": "Insufficient funds. Available balance: 100.00"
}
```

---

## 👤 6. Profile & KYC

> [!IMPORTANT]
> **KYC is Optional**: Providers can access all endpoints regardless of KYC status. KYC verification unlocks additional features (e.g., higher visibility, premium badges) but does NOT block core functionality.

### A. Submit KYC Documents (Provider)
**Intent:** Upload ID for verification to unlock premium features.
**Endpoint:** `POST /api/kyc/submit`

**Mobile UX Flow:**
1. **After Login (One-Time)**: If `user.kycStatus === "PENDING"` and user hasn't dismissed the prompt:
   - Show modal: "Complete your KYC to unlock all features"
   - Options: "Complete Now" or "Skip for Now"
   - Store dismissal in `AsyncStorage` to prevent re-showing
2. **Profile Tab**: Always show "Complete KYC" button if status is not "APPROVED"

#### Scenario 1: Submission
**Request Payload:**
```json
{
  "idFront": "https://storage.googleapis.com/.../front.jpg", // Pre-signed URLs or Base64 (prefer URL)
  "idBack": "https://storage.googleapis.com/.../back.jpg",
  "selfie": "https://storage.googleapis.com/.../selfie.jpg"
}
```
**Response (200 OK):**
```json
{
  "status": "SUBMITTED",
  "kycSubmittedAt": "2026-01-16T10:30:00Z"
}
```

**KYC Status Values:**
- `PENDING` - Not yet submitted (default for new providers)
- `SUBMITTED` - Documents uploaded, awaiting admin review
- `APPROVED` - Verified (unlocks premium features)
- `REJECTED` - Verification failed (user can resubmit)

---

### C. KYC Implementation Guide (Mobile)

#### 1. After Login Check
```javascript
// In your AuthContext or post-login handler
const handlePostLogin = async (user, token) => {
  // Store auth data
  await AsyncStorage.setItem('@auth_token', token);
  await AsyncStorage.setItem('@user', JSON.stringify(user));
  
  // Check if KYC prompt should be shown
  if (user.role === 'PROVIDER' && user.kycStatus === 'PENDING') {
    const hasSeenKycPrompt = await AsyncStorage.getItem('@kyc_prompt_dismissed');
    
    if (!hasSeenKycPrompt) {
      // Show one-time KYC prompt
      showKycPromptModal();
    }
  }
  
  // Navigate to home/dashboard
  navigation.navigate('Home');
};
```

#### 2. KYC Prompt Modal Component
```javascript
const KycPromptModal = ({ visible, onDismiss, onComplete }) => {
  const handleSkip = async () => {
    // Mark as dismissed so it doesn't show again
    await AsyncStorage.setItem('@kyc_prompt_dismissed', 'true');
    onDismiss();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Icon name="shield-check" size={64} color="#4CAF50" />
        
        <Text style={styles.title}>
          Complete Your KYC
        </Text>
        
        <Text style={styles.description}>
          Verify your identity to unlock all features:
          {'\n'}• Higher visibility in search
          {'\n'}• Premium provider badge
          {'\n'}• Access to advanced analytics
        </Text>
        
        <Button 
          title="Complete Now" 
          onPress={onComplete}
          style={styles.primaryButton}
        />
        
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>Skip for Now</Text>
        </TouchableOpacity>
        
        <Text style={styles.footnote}>
          You can complete this anytime from your Profile
        </Text>
      </View>
    </Modal>
  );
};
```

#### 3. Profile Tab KYC Section
```javascript
const ProfileScreen = () => {
  const { user } = useAuth();
  
  const renderKycSection = () => {
    if (user.role !== 'PROVIDER') return null;
    
    switch (user.kycStatus) {
      case 'PENDING':
        return (
          <Card style={styles.kycCard}>
            <Icon name="alert-circle" color="#FF9800" />
            <Text>Complete KYC to unlock premium features</Text>
            <Button 
              title="Verify Now" 
              onPress={() => navigation.navigate('KycUpload')}
            />
          </Card>
        );
      
      case 'SUBMITTED':
        return (
          <Card style={styles.kycCard}>
            <Icon name="clock" color="#2196F3" />
            <Text>KYC verification in progress...</Text>
          </Card>
        );
      
      case 'APPROVED':
        return (
          <Card style={styles.kycCard}>
            <Icon name="check-circle" color="#4CAF50" />
            <Text>✓ Verified Provider</Text>
          </Card>
        );
      
      case 'REJECTED':
        return (
          <Card style={styles.kycCard}>
            <Icon name="x-circle" color="#F44336" />
            <Text>Verification failed. Please resubmit.</Text>
            <Button 
              title="Resubmit Documents" 
              onPress={() => navigation.navigate('KycUpload')}
            />
          </Card>
        );
    }
  };
  
  return (
    <ScrollView>
      {renderKycSection()}
      {/* Rest of profile UI */}
    </ScrollView>
  );
};
```

#### 4. KYC Upload Screen
```javascript
const KycUploadScreen = () => {
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Upload images to your storage (S3, Firebase, etc.)
      const idFrontUrl = await uploadImage(idFront);
      const idBackUrl = await uploadImage(idBack);
      const selfieUrl = await uploadImage(selfie);
      
      // Submit to backend
      const token = await AsyncStorage.getItem('@auth_token');
      const response = await axios.post('/api/kyc/submit', {
        idFront: idFrontUrl,
        idBack: idBackUrl,
        selfie: selfieUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update user in storage
      const user = JSON.parse(await AsyncStorage.getItem('@user'));
      user.kycStatus = 'SUBMITTED';
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      
      Alert.alert('Success', 'KYC documents submitted for review');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit KYC documents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Identity Verification</Text>
      
      <ImagePicker
        label="ID Front"
        value={idFront}
        onChange={setIdFront}
      />
      
      <ImagePicker
        label="ID Back"
        value={idBack}
        onChange={setIdBack}
      />
      
      <ImagePicker
        label="Selfie with ID"
        value={selfie}
        onChange={setSelfie}
      />
      
      <Button
        title="Submit for Verification"
        onPress={handleSubmit}
        disabled={!idFront || !idBack || !selfie || loading}
        loading={loading}
      />
    </ScrollView>
  );
};
```

**Implementation Checklist:**
- [ ] Never block API calls based on KYC status
- [ ] Show one-time modal after first login (if PENDING)
- [ ] Store dismissal flag in AsyncStorage (`@kyc_prompt_dismissed`)
- [ ] Always show KYC status/button in Profile tab
- [ ] Explain benefits clearly ("unlock features" not "required")
- [ ] Provide easy "Skip for Now" option

---

### D. Update Profile
**Intent:** User updates bio/headline.
**Endpoint:** `PATCH /api/profile/me`

#### Scenario 1: Update Intro
**Request Payload:**
```json
{
  "headline": "Certified Expert Electrician",
  "bio": "10 years of experience in high voltage systems...",
  "languages": ["English", "Bemba"]
}
```

---

## ⭐️ 7. Reviews & Ratings

### A. Create Review
**Intent:** Client reviews a completed session.
**Endpoint:** `POST /api/reviews`

#### Scenario 1: Success
**Request Payload:**
```json
{
  "sessionId": "sess_123",
  "rating": 5, // 1-5 integer
  "comment": "Excellent service, very professional."
}
```
**Response (201 Created):**
```json
{
  "id": "rev_999",
  "createdAt": "2026-01-20T..."
}
```

---

## 💬 8. Chat & Messaging

### A. Send Message
**Intent:** Send a text message in an active session.
**Endpoint:** `POST /api/chat/messages`

#### Scenario 1: Sending
**Request Payload:**
```json
{
  "chatRoomId": "room_xyz",
  "content": "I am arriving in 5 minutes."
}
```
**Response (201 Created):** `{"id": "msg_456", "isRead": false}`

### B. Get Messages
**Intent:** Poll for new messages (or initial load).
**Endpoint:** `GET /api/chat/{chatRoomId}/messages`
**Response (200 OK):**
```json
[
  {
    "id": "msg_455",
    "senderId": "user_1",
    "content": "Hello?",
    "createdAt": "..."
  }
]
```

---

## 🔔 9. Notifications

### A. Get Notifications
**Intent:** Fetch recent alerts (Bookings, Payouts).
**Endpoint:** `GET /api/notifications`
**Response (200 OK):**
```json
[
  {
    "id": "notif_001",
    "type": "BOOKING_REQUEST",
    "title": "New Booking",
    "message": "Sarah requested a session.",
    "isRead": false,
    "data": { "bookingId": "bk-789" }
  }
]
```
