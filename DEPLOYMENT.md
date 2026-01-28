# Vercel Deployment Guide

## 🚀 Quick Deploy

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from project directory**
```bash
cd skill-matcher-pro-main
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **resumeai-pro** (or your choice)
   - Directory? **./skill-matcher-pro-main**
   - Override settings? **N**

5. **Deploy to production**
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Project**
   - Framework Preset: **Vite**
   - Root Directory: **skill-matcher-pro-main**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables** (see below)

5. **Click Deploy**

## 🔐 Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

### Required Variables

```bash
# OpenAI API Key (REQUIRED for AI features)
VITE_OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### Firebase Variables (Already in code, but can override)

```bash
VITE_FIREBASE_API_KEY=AIzaSyBnrbaEvRcO1kC5KOQL-f0cId1jH5C-8dM
VITE_FIREBASE_AUTH_DOMAIN=ai-resume-analyzer-13d49.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ai-resume-analyzer-13d49
VITE_FIREBASE_STORAGE_BUCKET=ai-resume-analyzer-13d49.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=656198145803
VITE_FIREBASE_APP_ID=1:656198145803:web:a73ab3bf556705e2f8f40e
VITE_FIREBASE_MEASUREMENT_ID=G-90RGJP4RBJ
```

**Note:** Firebase config is already hardcoded in `src/lib/firebase.ts`, so these are optional unless you want to override them.

## 🔧 Pre-Deployment Checklist

- [x] ✅ Build succeeds locally (`npm run build`)
- [x] ✅ Preview works (`npm run preview`)
- [x] ✅ Environment variables configured
- [x] ✅ Firebase authorized domains updated
- [x] ✅ OpenAI API key added
- [x] ✅ Git repository pushed

## 🧪 Test Build Locally

Before deploying, test the production build:

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

Visit http://localhost:4173 to test the production build.

## 🔥 Firebase Configuration for Production

### 1. Add Vercel Domain to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **ai-resume-analyzer-13d49**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain:
   - `your-app-name.vercel.app`
   - `your-custom-domain.com` (if using custom domain)

### 2. Update Firestore Security Rules

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

### 3. Enable Google OAuth for Production

1. Go to Firebase Console → Authentication → Sign-in method
2. Click on Google provider
3. Add your Vercel domain to authorized domains
4. Save changes

## 📝 Deployment Commands

### Deploy to Preview
```bash
vercel
```

### Deploy to Production
```bash
vercel --prod
```

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

### Remove Deployment
```bash
vercel rm [deployment-url]
```

## 🌐 Custom Domain Setup

### Add Custom Domain in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (can take up to 48 hours)

### Update Firebase Authorized Domains

1. Add custom domain to Firebase authorized domains
2. Update OAuth redirect URIs if using Google sign-in

## 🐛 Troubleshooting

### Analysis Stuck in Loading State (Spinning Icon)

**Symptom**: After clicking "Analyze Resume", the button shows a spinning icon indefinitely and never redirects to results.

**Solution**: This was fixed in the latest version. The issue was caused by improper state management in the navigation flow. Update to the latest code from the repository.

**Technical Details**: The `finally` block was resetting the loading state even during successful navigation, causing re-renders that blocked the redirect. The fix removes the `finally` block and only resets state on errors.

### AI Analysis Falling Back to Basic Analysis

**Symptom**: Toast notification shows "Using Basic Analysis - AI analysis unavailable" even though you configured the API key.

**Causes & Solutions**:

1. **Environment variable not set in Vercel**
   ```bash
   # Add via CLI
   echo YOUR_API_KEY | vercel env add VITE_OPENAI_API_KEY production --force
   
   # Verify
   vercel env ls
   ```

2. **API key invalid or expired**
   - Check your OpenAI dashboard
   - Verify the key has credits
   - Generate a new key if needed

3. **API key too short**
   - The key must be longer than 20 characters
   - Check for typos or truncation

**Verification**: Check browser console for logs:
```
AI Configuration Check: { hasApiKey: true, keyLength: 164, isConfigured: true }
```

### Build Fails

**Error: "Module not found"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: "Out of memory"**
- Increase Node memory: `NODE_OPTIONS=--max_old_space_size=4096 npm run build`
- Or add to `package.json`:
```json
"scripts": {
  "build": "NODE_OPTIONS=--max_old_space_size=4096 vite build"
}
```

### Firebase Authentication Not Working

1. Check authorized domains in Firebase Console
2. Verify environment variables are set correctly
3. Check browser console for CORS errors
4. Ensure Firebase config is correct

### OpenAI API Not Working

1. Verify `VITE_OPENAI_API_KEY` is set in Vercel
2. Check API key has sufficient credits
3. Verify API key permissions
4. Check browser console for errors

### Routes Not Working (404 on refresh)

- Ensure `vercel.json` has correct rewrites configuration
- Check that `outputDirectory` is set to `dist`

## 📊 Post-Deployment

### Monitor Your App

1. **Vercel Analytics**
   - Go to Dashboard → Analytics
   - View page views, performance, etc.

2. **Firebase Analytics**
   - Go to Firebase Console → Analytics
   - Track user engagement

3. **Error Tracking**
   - Check Vercel logs for errors
   - Monitor Firebase Console for auth issues

### Performance Optimization

1. **Enable Vercel Speed Insights**
```bash
npm install @vercel/speed-insights
```

Add to `src/main.tsx`:
```typescript
import { SpeedInsights } from "@vercel/speed-insights/react"

// Add <SpeedInsights /> to your app
```

2. **Enable Vercel Analytics**
```bash
npm install @vercel/analytics
```

Add to `src/main.tsx`:
```typescript
import { Analytics } from "@vercel/analytics/react"

// Add <Analytics /> to your app
```

## 🔒 Security Best Practices

### Production Checklist

- [ ] Environment variables set in Vercel (not in code)
- [ ] Firebase security rules configured
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] API keys have usage limits set
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (if needed)

### Recommended: Move OpenAI to Backend

For production, consider moving OpenAI API calls to a backend:

1. Create Vercel Serverless Functions
2. Move API key to backend
3. Call backend from frontend
4. Implement rate limiting

Example serverless function:
```typescript
// api/analyze.ts
import { OpenAI } from 'openai';

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Server-side only
  });
  
  // Your analysis logic here
}
```

## 📈 Scaling Considerations

### Free Tier Limits

**Vercel Free Tier:**
- 100 GB bandwidth/month
- 100 hours build time/month
- Unlimited deployments

**Firebase Free Tier:**
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage

### Upgrade When Needed

- Monitor usage in dashboards
- Upgrade to Pro plan if limits exceeded
- Consider caching strategies

## 🎉 Success!

Your app should now be live at:
- **Vercel URL**: `https://your-app-name.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

### Share Your App

- Share the URL with users
- Add to your portfolio
- Submit to directories
- Share on social media

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Vite Docs**: https://vitejs.dev/guide/

---

**Deployment Complete! 🚀**

Your ResumeAI Pro is now live and accessible worldwide!
