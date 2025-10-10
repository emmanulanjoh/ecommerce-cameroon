# AWS Deployment Architecture

## Recommended Setup

### Frontend (React)
- **S3 + CloudFront** (already configured)
- Static hosting with global CDN
- Cost: ~$1-5/month

### Backend (Express API)
- **AWS App Runner**
- Auto-scaling Node.js service
- Cost: ~$7-25/month

### Database
- **MongoDB Atlas** (managed)
- Or **DynamoDB** (serverless)
- Cost: ~$0-25/month

### File Storage
- **S3** (already configured)
- Product images/videos
- Cost: ~$1-10/month

## Deployment Steps

1. **Frontend to S3/CloudFront**
   ```bash
   cd client
   npm run build
   aws s3 sync build/ s3://your-frontend-bucket
   ```

2. **Backend to App Runner**
   - Connect GitHub repository
   - Auto-deploy on push
   - Configure environment variables

3. **Database Setup**
   - MongoDB Atlas cluster
   - Or DynamoDB tables

## Total Monthly Cost: $10-65