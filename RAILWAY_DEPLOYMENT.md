# Railway Deployment Guide

## Steps to Fix Your Railway Deployment

### 1. Update Environment Variables in Railway Dashboard

Go to your Railway project dashboard and set these environment variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://emma:Emma2018@cluster0.jff9i.mongodb.net/ecommerce_cameroon?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters
SESSION_SECRET=gytfrdesawq34dcf6gty879tf@34iKojij
APP_URL=https://commerce-cameroon.up.railway.app
WHATSAPP_WEBHOOK_URL=https://commerce-cameroon.up.railway.app/webhook/whatsapp
BUSINESS_NAME=Findall sourcing
BUSINESS_PHONE=+237678830036
BUSINESS_WHATSAPP_NUMBER=+237678830036
BUSINESS_EMAIL=emmanuelanjoh2016@gmail.com
BUSINESS_ADDRESS=Mimboman petit marche, Yaoundé, Cameroon
```

### 2. Deploy the Updated Code

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Fix Railway deployment configuration"
   git push origin main
   ```

2. Railway will automatically redeploy with the new configuration.

### 3. Check Deployment Status

After deployment, test these endpoints:
- Health check: `https://commerce-cameroon.up.railway.app/health`
- API test: `https://commerce-cameroon.up.railway.app/api/products`

### 4. Common Issues and Solutions

**If deployment still fails:**

1. Check Railway logs for specific error messages
2. Ensure all environment variables are set correctly
3. Verify MongoDB connection string is accessible from Railway
4. Make sure the build process completes successfully

**Database Connection Issues:**
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0) for Railway
- Verify the connection string includes the correct database name

**Build Issues:**
- Railway runs `npm run build` which compiles TypeScript and builds the React client
- Check that all dependencies are in `dependencies` not `devDependencies`

### 5. Files Added/Modified

- `railway.json` - Railway configuration with explicit build commands
- `nixpacks.toml` - Nixpacks configuration for Railway
- `Procfile` - Process definition
- `package.json` - Fixed build scripts and moved TypeScript to dependencies
- `src/app.ts` - Added health check endpoint
- `.env.production` - Production environment template

### 6. Build Process Fixed

The build failure was caused by:
1. TypeScript being in devDependencies (moved to dependencies)
2. Complex build chain failing (simplified to separate steps)
3. Missing explicit build configuration for Railway

### 6. Next Steps After Successful Deployment

1. Test all functionality on the live site
2. Update WhatsApp webhook URL in your Twilio console
3. Test the contact form and WhatsApp integration
4. Monitor Railway logs for any runtime errors