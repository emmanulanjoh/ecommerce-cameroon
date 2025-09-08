# GitHub Secrets Configuration

Add these secrets to your GitHub repository:

## Go to: Settings > Secrets and variables > Actions > New repository secret

### AWS Credentials
- `AWS_ACCESS_KEY_ID` = your_aws_access_key
- `AWS_SECRET_ACCESS_KEY` = your_aws_secret_key

### Frontend Configuration
- `REACT_APP_API_URL` = https://your-apprunner-url.amazonaws.com/api
- `REACT_APP_CLOUDFRONT_URL` = https://d35ew0puu9c5cz.cloudfront.net
- `REACT_APP_WHATSAPP_NUMBER` = +237678830036

### Deployment Targets
- `S3_FRONTEND_BUCKET` = ecommerce-cameroon-frontend
- `CLOUDFRONT_DISTRIBUTION_ID` = your_distribution_id

## How to Add Secrets:
1. Go to your GitHub repository
2. Click Settings tab
3. Click "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Add each secret above