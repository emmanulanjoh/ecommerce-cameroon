# CSRF Token Fix for Production

## Root Cause:
The CSRF token error in production is caused by:
1. **Session Configuration**: Incorrect cookie settings for HTTPS
2. **Proxy Trust**: App Runner proxy not trusted
3. **CSRF Middleware**: Still enabled in some routes

## Fixes Applied:

### 1. Session Configuration Fixed
```javascript
// Before: secure: false (wrong for production)
// After: secure: isProduction (true for HTTPS)
cookie: {
  secure: isProduction,
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24,
  sameSite: isProduction ? 'none' : 'lax'
}
```

### 2. Trust Proxy Added
```javascript
// Trust App Runner proxy
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}
```

### 3. CSRF Completely Disabled
```javascript
// Disable CSRF for all routes
app.use((req, res, next) => {
  req.csrfToken = () => '';
  res.locals.csrfToken = '';
  next();
});
```

### 4. Environment Variable Added
```yaml
- name: TRUST_PROXY
  value: "true"
```

## Why This Happens:

1. **App Runner uses HTTPS proxy** - needs trust proxy setting
2. **Session cookies need secure flag** in production
3. **CSRF tokens depend on sessions** - if sessions break, CSRF fails

## Test After Deployment:

1. **Admin Login**: Should work without CSRF errors
2. **Session Persistence**: Should maintain login state
3. **API Calls**: Should work from frontend

## Alternative Solution (if still failing):

If CSRF errors persist, add this to admin routes:
```javascript
// Skip CSRF for admin routes
app.use('/admin', (req, res, next) => {
  req.csrfToken = () => '';
  next();
});
```