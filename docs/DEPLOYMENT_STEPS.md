# AWS Deployment Steps

## Prerequisites
1. AWS CLI installed and configured
2. GitHub repository pushed
3. S3 buckets created:
   - `ecommerce-cameroon-frontend` (for React app)
   - `ecommerce-cameroon-assets` (for images/videos)

## Step 1: Deploy Backend to App Runner

### Via AWS Console:
1. Go to AWS App Runner console
2. Click "Create service"
3. Choose "Source code repository"
4. Connect your GitHub account
5. Select repository: `ecommerce-cameroon`
6. Branch: `main`
7. Build settings: Use `apprunner.yaml`
8. Service name: `ecommerce-cameroon-api`
9. Add environment variables from `.env.production`
10. Click "Create & deploy"

### Environment Variables to Add:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://emma:Emma2018@cluster0.jff9i.mongodb.net/ecommerce_cameroon_prod
JWT_SECRET=your_production_jwt_secret_here
SESSION_SECRET=your_production_session_secret_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=ecommerce-cameroon-assets
CLOUDFRONT_URL=https://d35ew0puu9c5cz.cloudfront.net
BUSINESS_PHONE=+237678830036
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=emmanuelanjoh2016@gmail.com
EMAIL_PASS=rwgm vlvg nxgp yezv
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

## Step 2: Deploy Frontend to S3/CloudFront

### Option A: Using batch file (Windows)
```bash
deploy-frontend.bat
```

### Option B: Manual commands
```bash
cd client
npm install
npm run build
cd ..
aws s3 sync client/build/ s3://ecommerce-cameroon-frontend --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Step 3: Update Frontend API URL

Update `client/src/config/api.ts`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-apprunner-url.amazonaws.com/api'
  : 'http://localhost:5000/api';
```

## Step 4: Configure CORS

Update backend CORS settings to allow your frontend domain:
```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-cloudfront-domain.cloudfront.net',
    'https://your-custom-domain.com'
  ],
  credentials: true
};
```

## Step 5: Test Deployment

1. Backend API: `https://your-apprunner-url.amazonaws.com/api/health`
2. Frontend: `https://your-cloudfront-domain.cloudfront.net`
3. Test key features:
   - Product listing
   - WhatsApp integration
   - File uploads to S3

## Estimated Costs
- App Runner: $7-25/month
- S3: $1-5/month
- CloudFront: $1-10/month
- **Total: $9-40/month**

## Monitoring
- App Runner logs: AWS Console > App Runner > Logs
- CloudFront metrics: AWS Console > CloudFront > Monitoring
- S3 usage: AWS Console > S3 > Metrics