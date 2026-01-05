# OAuth Setup Guide for Deindoctrination App

This guide will help you set up Google and Facebook OAuth authentication for your application.

## 🔧 Prerequisites

1. Google Developer Console account
2. Facebook Developer account
3. Your app running on `http://localhost:3000` (frontend) and `http://localhost:5000` (backend)

---

## 🔍 Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
   - Add authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:5000`

### Step 2: Configure Environment Variables

Add to your `backend/.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

---

## 📘 Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" > "Create App"
3. Choose "Consumer" app type
4. Fill in app details and create the app
5. Add Facebook Login product:
   - Go to "Add a Product" and select "Facebook Login"
   - Choose "Web" platform

### Step 2: Configure Facebook Login

1. In Facebook Login settings:
   - Valid OAuth Redirect URIs: `http://localhost:5000/api/auth/facebook/callback`
   - Valid OAuth Redirect URIs: `http://localhost:3000/`
2. In App Settings > Basic:
   - Add App Domains: `localhost`
   - Site URL: `http://localhost:3000`

### Step 3: Configure Environment Variables

Add to your `backend/.env` file:
```env
FACEBOOK_APP_ID=your-facebook-app-id-here
FACEBOOK_APP_SECRET=your-facebook-app-secret-here
```

---

## 🔐 Session Secret

Add a session secret to your `backend/.env` file:
```env
SESSION_SECRET=your-random-session-secret-key-here
```

Generate a random string for security. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Testing OAuth Integration

### Test Google OAuth:
1. Start your backend: `cd backend && npm start`
2. Start your frontend: `cd frontend && npm start`
3. Go to `http://localhost:3000/login`
4. Click "Continue with Google"
5. Complete Google authentication
6. You should be redirected to the dashboard

### Test Facebook OAuth:
1. Follow the same steps but click "Continue with Facebook"
2. Complete Facebook authentication
3. You should be redirected to the dashboard

---

## 🔍 Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**:
   - Check that your redirect URIs match exactly in OAuth provider settings
   - Ensure no trailing slashes

2. **"App Not Setup" Facebook error**:
   - Make sure your Facebook app is not in development mode for production
   - Add test users in Facebook app settings for development

3. **CORS errors**:
   - Ensure backend CORS is configured to allow frontend origin
   - Check that credentials are enabled in CORS settings

4. **Session issues**:
   - Make sure SESSION_SECRET is set in environment variables
   - Check that session middleware is properly configured

### Debug Steps:

1. Check browser console for errors
2. Check backend logs for OAuth callback errors
3. Verify environment variables are loaded correctly
4. Test OAuth provider settings with their debugging tools

---

## 🎯 Features Implemented

✅ **Google OAuth Integration**
- Sign in with Google account
- Automatic user creation and task assignment
- Profile picture integration
- Email verification bypass for OAuth users

✅ **Facebook OAuth Integration**
- Sign in with Facebook account
- Automatic user creation and task assignment
- Profile picture integration
- Email verification bypass for OAuth users

✅ **Seamless UI Integration**
- OAuth buttons match existing design
- Loading states and error handling
- Responsive design maintained
- Consistent with green color scheme

✅ **Security Features**
- JWT token generation for OAuth users
- Session management
- Account linking for existing users
- Secure redirect handling

---

## 📝 Notes

- OAuth users bypass email verification (accounts are pre-verified)
- OAuth users get 10 random tasks assigned automatically
- Existing users can link OAuth accounts to their existing accounts
- Profile pictures from OAuth providers are stored and can be displayed
- All existing functionality remains unchanged

The OAuth integration is now ready to use! Make sure to configure your OAuth provider credentials before testing.