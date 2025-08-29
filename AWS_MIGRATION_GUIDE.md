# AWS Migration Guide

## 🚀 Complete Migration from MongoDB to AWS Services

### Prerequisites
- AWS Account with programmatic access
- AWS CLI installed and configured
- Node.js and npm installed

## Step 1: Create AWS Resources

### 1.1 Create DynamoDB Table
```bash
aws dynamodb create-table \
  --table-name ecommerce-cameroon \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    IndexName=GSI1,KeySchema=[{AttributeName=GSI1PK,KeyType=HASH},{AttributeName=GSI1SK,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### 1.2 Create S3 Bucket
```bash
aws s3 mb s3://ecommerce-cameroon-assets --region us-east-1

# Enable public read access
aws s3api put-bucket-policy --bucket ecommerce-cameroon-assets --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ecommerce-cameroon-assets/*"
    }
  ]
}'
```

### 1.3 Create CloudFront Distribution
```bash
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "ecommerce-'$(date +%s)'",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-ecommerce-cameroon-assets",
        "DomainName": "ecommerce-cameroon-assets.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-ecommerce-cameroon-assets",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0
  },
  "Comment": "E-commerce Cameroon Assets CDN",
  "Enabled": true
}'
```

### 1.4 Create Redis Cluster (ElastiCache)
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id ecommerce-redis \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1 \
  --region us-east-1
```

## Step 2: Environment Variables

Add to Railway/your hosting platform:
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# DynamoDB
DYNAMODB_TABLE=ecommerce-cameroon

# S3 & CloudFront
S3_BUCKET_NAME=ecommerce-cameroon-assets
CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net

# Redis
REDIS_URL=redis://your-redis-endpoint.cache.amazonaws.com:6379

# Keep MongoDB for migration
MONGODB_URI=your-current-mongodb-uri
```

## Step 3: DynamoDB Table Design

### Single Table Design Pattern

| Entity Type | PK | SK | GSI1PK | GSI1SK |
|-------------|----|----|--------|--------|
| Product | PRODUCT#id | PRODUCT#id | CATEGORY#name | PRODUCT#name |
| User | USER#id | USER#id | EMAIL#email | USER#id |
| Order | ORDER#id | ORDER#id | USER#userId | ORDER#createdAt |
| Category | CATEGORY#id | CATEGORY#id | TYPE#category | CATEGORY#name |

## Step 4: Migration Script

Create `scripts/migrate-to-aws.js`:

```javascript
const mongoose = require('mongoose');
const { DynamoDBService } = require('../dist/services/dynamodb');
const { S3Service } = require('../dist/services/s3');
const { connectRedis } = require('../dist/config/aws');

async function migrateProducts() {
  console.log('🔄 Migrating Products...');
  
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  const Product = mongoose.model('Product', {
    nameEn: String,
    nameFr: String,
    price: Number,
    category: String,
    images: [String],
    description: String,
    stock: Number,
    createdAt: Date
  });

  const products = await Product.find({});
  
  for (const product of products) {
    // Migrate to DynamoDB
    await DynamoDBService.create({
      PK: `PRODUCT#${product._id}`,
      SK: `PRODUCT#${product._id}`,
      GSI1PK: `CATEGORY#${product.category}`,
      GSI1SK: `PRODUCT#${product.nameEn}`,
      id: product._id.toString(),
      nameEn: product.nameEn,
      nameFr: product.nameFr,
      price: product.price,
      category: product.category,
      images: product.images,
      description: product.description,
      stock: product.stock,
      entityType: 'PRODUCT'
    });
    
    console.log(`✅ Migrated product: ${product.nameEn}`);
  }
  
  console.log(`✅ Migrated ${products.length} products`);
}

async function migrateUsers() {
  console.log('🔄 Migrating Users...');
  
  const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    role: String,
    createdAt: Date
  });

  const users = await User.find({});
  
  for (const user of users) {
    await DynamoDBService.create({
      PK: `USER#${user._id}`,
      SK: `USER#${user._id}`,
      GSI1PK: `EMAIL#${user.email}`,
      GSI1SK: `USER#${user._id}`,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      entityType: 'USER'
    });
    
    console.log(`✅ Migrated user: ${user.email}`);
  }
  
  console.log(`✅ Migrated ${users.length} users`);
}

async function main() {
  try {
    await connectRedis();
    await migrateProducts();
    await migrateUsers();
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
```

## Step 5: Update Models

Create `src/models/aws/Product.ts`:

```typescript
import { DynamoDBService } from '../../services/dynamodb';
import { RedisService } from '../../services/redis';

export interface Product {
  id: string;
  nameEn: string;
  nameFr?: string;
  price: number;
  category: string;
  images: string[];
  description?: string;
  stock: number;
  createdAt: string;
}

export class ProductModel {
  static async create(productData: Omit<Product, 'id' | 'createdAt'>) {
    const id = Date.now().toString();
    const product = {
      PK: `PRODUCT#${id}`,
      SK: `PRODUCT#${id}`,
      GSI1PK: `CATEGORY#${productData.category}`,
      GSI1SK: `PRODUCT#${productData.nameEn}`,
      id,
      ...productData,
      entityType: 'PRODUCT'
    };
    
    await DynamoDBService.create(product);
    
    // Cache the product
    await RedisService.set(RedisService.keys.product(id), product, 3600);
    
    return product;
  }

  static async findById(id: string) {
    // Try cache first
    const cached = await RedisService.get(RedisService.keys.product(id));
    if (cached) return cached;
    
    // Get from DynamoDB
    const product = await DynamoDBService.get(`PRODUCT#${id}`, `PRODUCT#${id}`);
    
    if (product) {
      // Cache for 1 hour
      await RedisService.set(RedisService.keys.product(id), product, 3600);
    }
    
    return product;
  }

  static async findByCategory(category: string) {
    // Try cache first
    const cacheKey = RedisService.keys.products(category);
    const cached = await RedisService.get(cacheKey);
    if (cached) return cached;
    
    // Query DynamoDB GSI
    const products = await DynamoDBService.query(`CATEGORY#${category}`);
    
    // Cache for 30 minutes
    await RedisService.set(cacheKey, products, 1800);
    
    return products;
  }

  static async findAll() {
    const cacheKey = RedisService.keys.products();
    const cached = await RedisService.get(cacheKey);
    if (cached) return cached;
    
    // This would require a scan operation - consider pagination
    // For now, we'll get all categories and combine
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen'];
    const allProducts = [];
    
    for (const category of categories) {
      const products = await this.findByCategory(category);
      allProducts.push(...products);
    }
    
    await RedisService.set(cacheKey, allProducts, 1800);
    return allProducts;
  }

  static async update(id: string, updates: Partial<Product>) {
    const updated = await DynamoDBService.update(
      `PRODUCT#${id}`, 
      `PRODUCT#${id}`, 
      updates
    );
    
    // Update cache
    await RedisService.set(RedisService.keys.product(id), updated, 3600);
    
    return updated;
  }

  static async delete(id: string) {
    await DynamoDBService.delete(`PRODUCT#${id}`, `PRODUCT#${id}`);
    
    // Remove from cache
    await RedisService.del(RedisService.keys.product(id));
  }
}
```

## Step 6: Run Migration

1. **Install dependencies:**
```bash
npm install
```

2. **Build TypeScript:**
```bash
npm run build:ts
```

3. **Run migration:**
```bash
node scripts/migrate-to-aws.js
```

4. **Update API routes** to use new models

5. **Test thoroughly** before switching production

## Step 7: Cleanup

After successful migration:
1. Update all API endpoints to use AWS services
2. Remove MongoDB dependencies
3. Delete MongoDB database
4. Update environment variables

## Cost Optimization

- Use DynamoDB On-Demand pricing for variable workloads
- Set up S3 lifecycle policies for old images
- Use CloudFront caching to reduce S3 requests
- Monitor Redis memory usage

## Monitoring

Set up CloudWatch alarms for:
- DynamoDB throttling
- S3 request errors
- Redis memory usage
- Lambda function errors

---

**🎉 Your e-commerce platform is now running on AWS with better performance, scalability, and cost efficiency!**