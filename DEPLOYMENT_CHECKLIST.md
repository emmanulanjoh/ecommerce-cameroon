# Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. GitHub Repository
- [ ] Code pushed to `main` branch
- [ ] GitHub secrets configured (see GITHUB_SECRETS.md)

### 2. AWS Resources Created
- [ ] S3 bucket: `ecommerce-cameroon-frontend`
- [ ] S3 bucket: `ecommerce-cameroon-assets` 
- [ ] CloudFront distribution configured
- [ ] IAM user with S3/CloudFront permissions

### 3. Environment Variables
- [ ] Update `.env.production` with actual values
- [ ] Update `client/.env.production` with App Runner URL

## 🚀 Deployment Steps

### Step 1: Deploy Backend
1. Go to AWS App Runner console
2. Create service from GitHub
3. Repository: `ecommerce-cameroon`
4. Branch: `main`
5. Build settings: Use `apprunner.yaml`
6. Add all environment variables from `.env.production`
7. Deploy and get App Runner URL

### Step 2: Update Frontend Config
1. Update `client/.env.production`:
   ```
   REACT_APP_API_URL=https://YOUR_APPRUNNER_URL.amazonaws.com/api
   ```
2. Update GitHub secret `REACT_APP_API_URL`

### Step 3: Deploy Frontend
1. Push updated config to GitHub
2. GitHub Actions will auto-deploy to S3
3. CloudFront will serve the frontend

### Step 4: Test Deployment
- [ ] Backend health: `https://YOUR_APPRUNNER_URL/api/health`
- [ ] Frontend: `https://YOUR_CLOUDFRONT_URL`
- [ ] API calls working
- [ ] WhatsApp integration working
- [ ] File uploads to S3 working

## 🔧 Post-Deployment

### Monitor
- App Runner logs
- CloudFront metrics
- S3 usage

### Update DNS (Optional)
- Point custom domain to CloudFront
- Update CORS origins

## 📋 Quick Commands

```bash
# Test locally first
npm run dev:full

# Check build
npm run build
cd client && npm run build

# Manual frontend deploy
aws s3 sync client/build/ s3://ecommerce-cameroon-frontend --delete
```