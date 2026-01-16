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

## 🔍 2. Discovery & Search

### A. Get Categories
**Intent:** Fetch all available service categories and subcategories.
**Endpoint:** `GET /api/categories`

**Response (200 OK):**
```json
{
  "categories": [
    {
      "id": "cat-001",
      "name": "Home Services",
      "description": "Household maintenance and repairs",
      "icon": "home",
      "subcategories": [
        {
          "id": "subcat-001",
          "name": "Plumbing",
          "description": "Water and drainage systems",
          "icon": "wrench"
        },
        {
          "id": "subcat-002",
          "name": "Electrical",
          "description": "Electrical installations and repairs",
          "icon": "zap"
        }
      ]
    },
    {
      "id": "cat-002",
      "name": "Professional Services",
      "description": "Business and consulting services",
      "icon": "briefcase",
      "subcategories": []
    }
  ],
  "count": 2
}
```

**Mobile UX:**
- Cache categories in `AsyncStorage` on app launch
- Refresh daily or when user pulls to refresh
- Use for filter dropdowns and category browsing

---

### B. Search Providers
**Intent:** Find service providers based on search query and filters.
**Endpoint:** `GET /api/providers/search`

**Query Parameters:**
- `q` (string, optional): Search term (searches name and service titles)
- `category` (string, optional): Filter by category name
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter

#### Scenario 1: Search with Filters
**Request:** 
```
GET /api/providers/search?q=plumber&category=Home Services&minPrice=100&maxPrice=500
```

**Response (200 OK):**
```json
[
  {
    "id": "prov-001",
    "name": "Mario Bros Plumbing",
    "email": "mario@plumbing.com",
    "image": "https://storage.../mario.jpg",
    "role": "PROVIDER",
    "username": "mario_plumber",
    "kycStatus": "APPROVED",
    "rating": 4.9,
    "reviewCount": 150,
    "profile": {
      "headline": "Expert Plumbing & Heating",
      "bio": "20 years of experience...",
      "location": "Lusaka",
      "isVerified": true
    },
    "providerServices": [
      {
        "id": "svc-101",
        "title": "Pipe Repair & Replacement",
        "description": "Fix leaks, replace damaged pipes",
        "price": 350,
        "duration": 60,
        "category": "Plumbing",
        "isActive": true
      },
      {
        "id": "svc-102",
        "title": "Drain Cleaning",
        "description": "Clear blocked drains",
        "price": 200,
        "duration": 45,
        "category": "Plumbing",
        "isActive": true
      }
    ]
  }
]
```

#### Scenario 2: Browse All Providers
**Request:** `GET /api/providers/search` (no parameters)

**Response:** Returns all APPROVED providers with their services

#### Scenario 3: No Results
**Request:** `GET /api/providers/search?q=nonexistent`

**Response (200 OK):** `[]` (Empty Array)

**Mobile Implementation:**
```javascript
const searchProviders = async (query, filters) => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await axios.get(
    `/api/providers/search?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  return response.data;
};
```

**Search Best Practices:**
- Debounce search input (300-500ms) to reduce API calls
- Show loading skeleton while searching
- Cache recent searches in `AsyncStorage`
- Display "No results" with suggestions to broaden search
- Sort results by rating or relevance

---

### C. Get Provider Details
**Intent:** View full provider profile and all services.
**Endpoint:** `GET /api/providers/{providerId}`

**Response (200 OK):**
```json
{
  "id": "prov-001",
  "name": "Mario Bros Plumbing",
  "image": "...",
  "kycStatus": "APPROVED",
  "rating": 4.9,
  "reviewCount": 150,
  "profile": {
    "headline": "Expert Plumbing & Heating",
    "bio": "20 years of experience in residential and commercial plumbing...",
    "location": "Lusaka",
    "languages": ["English", "Bemba"],
    "isVerified": true
  },
  "providerServices": [...],
  "providerReviews": [
    {
      "id": "rev-001",
      "rating": 5,
      "comment": "Excellent service!",
      "client": { "name": "Sarah C." },
      "createdAt": "2026-01-15T..."
    }
  ]
}
```

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

### A. Get Bookings (User & Provider)
**Intent:** Retrieve all bookings for the authenticated user.
- **Client:** Shows bookings you requested.
- **Provider:** Shows bookings requested for your services.
- **Mixed:** Shows both if applicable.

**Endpoint:** `GET /api/bookings`

**Response (200 OK):**
```json
[
  {
    "id": "bk-789",
    "status": "PENDING",
    "requestedTime": "2026-01-20T14:00:00.000Z",
    "notes": "Gate code is 1234",
    "createdAt": "2026-01-16T12:00:00.000Z",
    "service": {
      "id": "svc-101",
      "title": "Pipe Repair",
      "price": 350,
      "duration": 60,
      "provider": {
        "id": "prov-001",
        "name": "Mario Bros",
        "image": "...",
        "role": "PROVIDER"
      }
    },
    "client": {
      "id": "user-001",
      "name": "Sarah Connor",
      "image": null
    }
  }
]
```

### B. Create Request (Client)
**Intent:** Client requests a session.
**Endpoint:** `POST /api/bookings`

#### Scenario 1: Schedule a Session
**Request Payload:**
```json
{
  "serviceId": "svc-101",
  "date": "2026-01-20T14:00:00Z", // ISO Date String
  "notes": "Gate code is 1234. Please bring own tools."
}
```
**Response (201 Created):**
```json
{
  "id": "bk-789",
  "status": "PENDING",
  "requestedTime": "2026-01-20T14:00:00.000Z",
  "service": { "title": "Pipe Repair" },
  "client": { "name": "Sarah Connor" }
}
```

### C. Respond to Request (Provider)
**Intent:** Provider Accepts or Declines.
**Endpoint:** `POST /api/bookings/{id}/respond`

#### Scenario 1: Accept
**Request Payload:**
```json
{
  "status": "accepted" // "accepted" or "declined"
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
