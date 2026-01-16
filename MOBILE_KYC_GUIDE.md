# Mobile KYC Implementation Guide

## Overview
KYC (Know Your Customer) verification is **optional** for providers. It unlocks premium features but does NOT block access to core functionality.

## Implementation Flow

### 1. After Login Check
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

### 2. KYC Prompt Modal Component
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

### 3. Profile Tab KYC Button
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

### 4. KYC Upload Screen
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

## Key Points

1. **No Blocking**: Never prevent API calls based on KYC status
2. **One-Time Prompt**: Show modal only once after first login
3. **Persistent Access**: Profile tab always shows KYC status/button
4. **Clear Benefits**: Explain what features KYC unlocks
5. **Easy Dismissal**: "Skip for Now" option is prominent
6. **Status Tracking**: Use `@kyc_prompt_dismissed` flag in AsyncStorage

## Backend Considerations

Ensure your backend:
- Does NOT require KYC for core endpoints (bookings, wallet, etc.)
- Returns `kycStatus` in user object on login/register
- Allows KYC submission at any time
- Provides clear status values: PENDING, SUBMITTED, APPROVED, REJECTED
