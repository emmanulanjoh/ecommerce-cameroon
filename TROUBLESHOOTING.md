# App Runner Deployment Troubleshooting

## Common Issues & Solutions

### 1. Build Failed - TypeScript Issues
**Problem**: `npm run build` fails during deployment

**Solutions**:
```bash
# Option A: Fix TypeScript build locally first
npm install
npm run build
# Check if dist/ folder is created

# Option B: Use JavaScript version
# Change apprunner.yaml command to:
command: node src/server.js
```

### 2. Missing Dependencies
**Problem**: Dependencies not found during build

**Solution**: Update apprunner.yaml:
```yaml
build:
  commands:
    build:
      - npm install --production=false
      - npm run build
```

### 3. Port Configuration Issues
**Problem**: App Runner can't connect to your app

**Solution**: Ensure server listens on all interfaces:
```javascript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4. Environment Variables Missing
**Problem**: App crashes due to missing env vars

**Solution**: Add these to App Runner:
- NODE_ENV=production
- PORT=5000
- MONGODB_URI=your_mongodb_connection
- JWT_SECRET=your_jwt_secret

## Alternative: Deploy to Elastic Beanstalk

If App Runner continues to fail:

1. **Create .ebextensions/nodecommand.config**:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
```

2. **Deploy**:
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
eb init
eb create ecommerce-cameroon-prod
eb deploy
```

## Quick Fix: Manual Deployment

1. **Build locally**:
```bash
npm run build
```

2. **Create deployment package**:
```bash
# Include: package.json, dist/, node_modules/
zip -r app.zip package.json dist/ node_modules/
```

3. **Upload to App Runner or EB**