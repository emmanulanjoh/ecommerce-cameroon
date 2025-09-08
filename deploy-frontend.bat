@echo off
echo Building React frontend...
cd client
call npm install
call npm run build
cd ..

echo Deploying to S3...
aws s3 sync client/build/ s3://ecommerce-cameroon-frontend --delete

echo Invalidating CloudFront cache...
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo Frontend deployment complete!
pause