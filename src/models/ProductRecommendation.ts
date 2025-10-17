import mongoose, { Document, Schema } from 'mongoose';

export interface IProductRecommendation extends Document {
  productId: mongoose.Types.ObjectId;
  relatedProducts: mongoose.Types.ObjectId[];
  viewedTogether: mongoose.Types.ObjectId[];
  boughtTogether: mongoose.Types.ObjectId[];
  similarProducts: mongoose.Types.ObjectId[];
  lastUpdated: Date;
}

const ProductRecommendationSchema = new Schema<IProductRecommendation>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  relatedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  viewedTogether: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  boughtTogether: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  similarProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export const ProductRecommendation = mongoose.model<IProductRecommendation>('ProductRecommendation', ProductRecommendationSchema);