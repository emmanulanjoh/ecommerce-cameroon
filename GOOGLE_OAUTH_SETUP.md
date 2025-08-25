# Google OAuth Setup Guide

## 1. Create Google OAuth Credentials

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
     - `http://localhost:5000/api/auth/google/callback` (development)
     - `https://ecommerce-cameroon-production.up.railway.app/api/auth/google/callback` (Railway production)
     - Replace `your-railway-app` with your actual Railway app name

## 2. Update Environment Variables

**For Development (.env file):**
```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:3000
```

**For Railway Production (Environment Variables):**
```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_REDIRECT_URI=https://your-railway-app.up.railway.app/api/auth/google/callback
CLIENT_URL=https://your-railway-frontend.up.railway.app
```

## 3. Features Implemented

- ✅ Modern login/register pages with Material-UI design
- ✅ Google OAuth integration
- ✅ Automatic user creation for Google users
- ✅ JWT token generation and management
- ✅ Responsive design with gradient backgrounds
- ✅ Form validation and error handling

## 4. Usage

Users can now:
1. Sign in with email/password (traditional)
2. Sign in with Google account (OAuth)
3. Register new accounts with both methods
4. Automatic redirect after successful authentication

## 5. Security Notes

- Google users get a placeholder password in the database
- JWT tokens are used for session management
- All OAuth flows are handled server-side for security
- User data is validated before storage

## 6. Railway Deployment Steps

1. **Get your Railway URLs:**
   - Backend: `https://your-backend-app.up.railway.app`
   - Frontend: `https://your-frontend-app.up.railway.app`

2. **Update Google Cloud Console:**
   - Add Railway backend URL to authorized redirect URIs
   - Format: `https://your-backend-app.up.railway.app/api/auth/google/callback`

3. **Set Railway Environment Variables:**
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=https://your-backend-app.up.railway.app/api/auth/google/callback
   CLIENT_URL=https://your-frontend-app.up.railway.app
   ```

4. **Update backend code for production:**
   - The redirect URI will automatically use Railway's domain
   - CLIENT_URL will redirect users to your Railway frontend

## 7. Testing

**Development:**
1. Start your development servers
2. Navigate to `/login` or `/register`
3. Try both traditional and Google authentication

**Production (Railway):**
1. Deploy to Railway
2. Test Google OAuth with your Railway URLs
3. Verify users are created in MongoDB Atlas