# Firebase Integration Guide

## ✨ Features Implemented

### 1. **Firebase Authentication**
- Email/Password sign-in
- Google OAuth sign-in
- User session management
- Protected routes

### 2. **Cloud Firestore Database**
- Store analysis history in the cloud
- User-specific data isolation
- Real-time sync capabilities
- Automatic backups

### 3. **Firebase Analytics**
- Track user engagement
- Monitor app usage
- Performance insights

## 📦 Files Created

### Firebase Configuration
- `src/lib/firebase.ts` - Firebase initialization and exports
- `src/lib/firestoreService.ts` - Firestore database operations
- `src/contexts/AuthContext.tsx` - Authentication context provider

### Updated Files
- `src/App.tsx` - Wrapped with AuthProvider
- `src/components/Navbar.tsx` - Added user menu and logout
- `src/components/ui/sign-in-card.tsx` - Integrated Firebase auth
- `src/pages/Analyzer.tsx` - Save to Firestore when logged in

## 🔐 Authentication Flow

### Sign In Process
1. User enters email/password or clicks "Sign in with Google"
2. Firebase authenticates the user
3. AuthContext updates with user info
4. User is redirected to dashboard
5. Navbar shows user email and logout option

### Sign Out Process
1. User clicks logout in dropdown menu
2. Firebase signs out the user
3. AuthContext clears user info
4. User is redirected to sign-in page

## 💾 Data Storage Strategy

### Dual Storage System
The app now uses **both** localStorage and Firestore:

**For Non-Logged In Users:**
- Data saved to browser localStorage only
- Works offline
- Limited to single device
- No cloud backup

**For Logged In Users:**
- Data saved to **both** localStorage and Firestore
- localStorage for instant access
- Firestore for cloud backup and sync
- Access from any device
- Automatic backups

### Why Dual Storage?
1. **Instant Performance**: localStorage provides immediate access
2. **Offline Support**: App works without internet
3. **Cloud Backup**: Firestore ensures data isn't lost
4. **Cross-Device**: Access history from any device when logged in
5. **Graceful Degradation**: Works even if Firestore fails

## 🔧 Firebase Configuration

### Current Setup
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBnrbaEvRcO1kC5KOQL-f0cId1jH5C-8dM",
  authDomain: "ai-resume-analyzer-13d49.firebaseapp.com",
  projectId: "ai-resume-analyzer-13d49",
  storageBucket: "ai-resume-analyzer-13d49.firebasestorage.app",
  messagingSenderId: "656198145803",
  appId: "1:656198145803:web:a73ab3bf556705e2f8f40e",
  measurementId: "G-90RGJP4RBJ"
};
```

### Services Enabled
- ✅ Authentication (Email/Password, Google)
- ✅ Cloud Firestore
- ✅ Analytics

## 📊 Firestore Data Structure

### Collection: `analyses`
```typescript
{
  id: string (auto-generated),
  userId: string (Firebase UID),
  timestamp: Timestamp,
  roleName: string,
  roleId: string,
  resumeName: string,
  results: {
    matchPercentage: number,
    atsScore: number,
    matchedSkills: string[],
    missingSkills: string[],
    suggestions: string[],
    detailedFeedback?: string,
    isAIPowered?: boolean
  }
}
```

### Security Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /analyses/{analysisId} {
      // Users can only read/write their own analyses
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // Allow create if authenticated
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🚀 How to Use

### For Users

**1. Sign Up / Sign In**
- Go to `/signin`
- Enter email/password or use Google sign-in
- Get redirected to dashboard

**2. Analyze Resumes**
- Analyses are automatically saved to cloud
- Access from any device
- Never lose your history

**3. View Dashboard**
- See all your analyses across all devices
- Track improvement over time
- Export reports as PDF

**4. Sign Out**
- Click your email in navbar
- Select "Logout"
- Data remains in cloud for next login

### For Developers

**1. Enable Firebase Services**
```bash
# Already installed
npm install firebase
```

**2. Set Up Firestore**
- Go to Firebase Console
- Enable Cloud Firestore
- Set up security rules (see above)
- Create indexes if needed

**3. Enable Authentication**
- Go to Firebase Console → Authentication
- Enable Email/Password provider
- Enable Google provider
- Add authorized domains

**4. Configure Google OAuth**
- Add OAuth 2.0 Client ID in Google Cloud Console
- Add authorized redirect URIs:
  - `http://localhost:8081`
  - `https://your-domain.com`

## 🔒 Security Best Practices

### Current Implementation
✅ API keys in code (safe for client-side Firebase)
✅ Authentication required for data access
✅ User-specific data isolation
✅ HTTPS only in production

### Recommended Additions
1. **Firestore Security Rules**: Implement strict rules
2. **Rate Limiting**: Prevent abuse
3. **Email Verification**: Verify user emails
4. **Password Requirements**: Enforce strong passwords
5. **Session Management**: Auto-logout after inactivity

## 📈 Firebase Console Access

### View Your Data
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `ai-resume-analyzer-13d49`
3. Navigate to:
   - **Authentication** → See all users
   - **Firestore Database** → View analyses
   - **Analytics** → Track usage

### Monitor Usage
- **Authentication**: User sign-ins, active users
- **Firestore**: Read/write operations, storage
- **Analytics**: Page views, user engagement

## 🎯 Features Enabled by Firebase

### Current
- ✅ User authentication
- ✅ Cloud data storage
- ✅ Cross-device sync
- ✅ Google sign-in
- ✅ Analytics tracking

### Future Possibilities
- 📧 Email verification
- 🔔 Push notifications
- 📱 Mobile app sync
- 🤝 Social features
- 💬 Real-time chat support
- 📊 Advanced analytics
- 🎯 A/B testing
- 🔐 Two-factor authentication

## 🐛 Troubleshooting

### "Firebase not initialized"
- Check that `firebase.ts` is imported
- Verify Firebase config is correct

### "Permission denied"
- User must be logged in
- Check Firestore security rules
- Verify userId matches

### "Google sign-in failed"
- Check OAuth configuration
- Verify authorized domains
- Check browser console for errors

### "Data not syncing"
- Check internet connection
- Verify Firestore is enabled
- Check browser console for errors

## 💰 Firebase Pricing

### Free Tier (Spark Plan)
- **Authentication**: 50,000 MAU (Monthly Active Users)
- **Firestore**: 
  - 1 GB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
- **Analytics**: Unlimited

### Estimated Usage
- **Small app** (100 users): Free tier sufficient
- **Medium app** (1,000 users): ~$5-10/month
- **Large app** (10,000+ users): ~$50-100/month

## 🔄 Migration from localStorage

### Automatic Migration
The app automatically handles both:
1. New users → Firestore only
2. Existing users → Keep localStorage + add Firestore
3. Non-logged users → localStorage only

### Manual Migration (Optional)
To migrate existing localStorage data to Firestore:
```typescript
// Add this function to migrate old data
async function migrateLocalStorageToFirestore(userId: string) {
  const localHistory = historyService.getHistory();
  
  for (const analysis of localHistory) {
    await firestoreService.saveAnalysis(
      userId,
      analysis.roleName,
      analysis.roleId,
      analysis.results,
      analysis.resumeName
    );
  }
}
```

## 📝 Next Steps

1. **Set up Firestore Security Rules** in Firebase Console
2. **Enable Email Verification** for new users
3. **Add Password Reset** functionality
4. **Implement User Profile** page
5. **Add Social Sharing** features
6. **Set up Firebase Hosting** for deployment

---

**Firebase Integration Complete! 🎉**

Your app now has:
- ✅ User authentication
- ✅ Cloud storage
- ✅ Cross-device sync
- ✅ Google sign-in
- ✅ Analytics tracking

Users can now sign in and access their data from anywhere!
