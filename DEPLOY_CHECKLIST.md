# 🚀 Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

- [ ] **Build succeeds locally**
  ```bash
  npm run build
  ```

- [ ] **Preview works correctly**
  ```bash
  npm run preview
  # Visit http://localhost:4173
  ```

- [ ] **All features tested**
  - [ ] Sign up / Sign in
  - [ ] Resume analysis
  - [ ] Dashboard loads
  - [ ] PDF export works
  - [ ] Google OAuth works

- [ ] **Environment variables ready**
  - [ ] OpenAI API key
  - [ ] Firebase config (if overriding)

- [ ] **Code committed to Git**
  ```bash
  git add .
  git commit -m "Ready for deployment"
  git push origin main
  ```

## Vercel Deployment

- [ ] **Install Vercel CLI** (if not already)
  ```bash
  npm install -g vercel
  ```

- [ ] **Login to Vercel**
  ```bash
  vercel login
  ```

- [ ] **Deploy to production**
  ```bash
  cd skill-matcher-pro-main
  vercel --prod
  ```

- [ ] **Add environment variables in Vercel**
  - Go to: Project Settings → Environment Variables
  - Add: `VITE_OPENAI_API_KEY`

## Firebase Configuration

- [ ] **Add Vercel domain to Firebase**
  1. Go to Firebase Console
  2. Authentication → Settings → Authorized domains
  3. Add your Vercel URL (e.g., `your-app.vercel.app`)

- [ ] **Update Firestore Security Rules**
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /analyses/{analysisId} {
        allow read, write: if request.auth != null 
          && request.auth.uid == resource.data.userId;
        allow create: if request.auth != null 
          && request.auth.uid == request.resource.data.userId;
      }
    }
  }
  ```

- [ ] **Enable Google OAuth for production domain**
  - Firebase Console → Authentication → Sign-in method
  - Google provider → Add authorized domain

## Post-Deployment Testing

- [ ] **Visit deployed URL**
  - Check: `https://your-app.vercel.app`

- [ ] **Test all features on production**
  - [ ] Homepage loads
  - [ ] Sign up works
  - [ ] Sign in works
  - [ ] Google OAuth works
  - [ ] Resume analysis works
  - [ ] AI analysis works (check OpenAI key)
  - [ ] Dashboard loads
  - [ ] History saves to Firestore
  - [ ] PDF export works
  - [ ] Logout works

- [ ] **Check browser console for errors**
  - Open DevTools (F12)
  - Look for any red errors
  - Fix if needed and redeploy

- [ ] **Test on different devices**
  - [ ] Desktop
  - [ ] Mobile
  - [ ] Tablet

- [ ] **Test on different browsers**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

## Performance & Monitoring

- [ ] **Enable Vercel Analytics** (optional)
  ```bash
  npm install @vercel/analytics
  ```

- [ ] **Enable Speed Insights** (optional)
  ```bash
  npm install @vercel/speed-insights
  ```

- [ ] **Check Firebase usage**
  - Firebase Console → Usage tab
  - Monitor reads/writes
  - Set up billing alerts

- [ ] **Check OpenAI usage**
  - OpenAI Dashboard → Usage
  - Monitor API calls
  - Set usage limits

## Security

- [ ] **Environment variables not in code**
  - Check `.env` is in `.gitignore`
  - Verify no API keys in source code

- [ ] **Firebase security rules active**
  - Test unauthorized access blocked

- [ ] **HTTPS enabled** (automatic with Vercel)

- [ ] **CORS configured correctly**

## Documentation

- [ ] **Update README with live URL**
  ```markdown
  ## 🌐 Live Demo
  **Deployed on Vercel**: https://your-app.vercel.app
  ```

- [ ] **Add deployment badge** (optional)
  ```markdown
  [![Deployed on Vercel](https://vercel.com/button)](https://your-app.vercel.app)
  ```

## Optional Enhancements

- [ ] **Custom domain setup**
  - Vercel Dashboard → Domains
  - Add custom domain
  - Update DNS records
  - Update Firebase authorized domains

- [ ] **Set up monitoring**
  - Error tracking (Sentry)
  - Performance monitoring
  - User analytics

- [ ] **Enable caching**
  - Configure Vercel caching headers
  - Optimize asset delivery

## Troubleshooting

If deployment fails:

1. **Check build logs in Vercel**
   - Look for error messages
   - Fix issues and redeploy

2. **Verify environment variables**
   - Ensure all required vars are set
   - Check for typos

3. **Test locally first**
   ```bash
   npm run build
   npm run preview
   ```

4. **Clear Vercel cache**
   ```bash
   vercel --force
   ```

## Success! 🎉

- [ ] **Deployment successful**
- [ ] **All tests passing**
- [ ] **App accessible at production URL**
- [ ] **Share with users!**

---

**Your ResumeAI Pro is now live! 🚀**

Share your app:
- 📱 Social media
- 💼 LinkedIn
- 🌐 Portfolio
- 📧 Email signature
