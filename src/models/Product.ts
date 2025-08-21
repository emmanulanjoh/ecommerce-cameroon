import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  nameEn: string;
  nameFr?: string;
  descriptionEn: string;
  descriptionFr?: string;
  price: number;
  category: string;
  images: string[];
  thumbnailImage?: string;
  videoUrl?: string;
  featured: boolean;
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  averageRating?: number;
  reviewCount?: number;
  isActive: boolean;
  condition?: 'new' | 'refurbished' | 'used';
  conditionGrade?: 'A' | 'B' | 'C';
  warrantyMonths?: number;
  createdAt: Date;
  updatedAt: Date;
  getName(language: string): string;
  getDescription(language: string): string;
}

const ProductSchema: Schema = new Schema(
  {
    nameEn: {
      type: String,
      required: [true, 'Product name in English is required'],
      trim: true
    },
    nameFr: {
      type: String,
      trim: true
    },
    descriptionEn: {
      type: String,
      required: [true, 'Product description in English is required']
    },
    descriptionFr: {
      type: String
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      lowercase: true
    },
    images: {
      type: [String],
      default: []
    },
    thumbnailImage: {
      type: String
    },
    videoUrl: {
      type: String
    },
    featured: {
      type: Boolean,
      default: false
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockQuantity: {
      type: Number,
      min: 0
    },
    sku: {
      type: String
    },
    weight: {
      type: Number,
      min: 0
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 }
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    condition: {
      type: String,
      enum: ['new', 'refurbished', 'used'],
      default: 'new'
    },
    conditionGrade: {
      type: String,
      enum: ['A', 'B', 'C']
    },
    warrantyMonths: {
      type: Number,
      min: 0,
      max: 36,
      default: 12
    }
  },
  {
    timestamps: true
  }
);

// Method to get name based on language
ProductSchema.methods.getName = function(language: string): string {
  if (language === 'fr' && this.nameFr) {
    return this.nameFr;
  }
  return this.nameEn;
};

// Method to get description based on language
ProductSchema.methods.getDescription = function(language: string): string {
  if (language === 'fr' && this.descriptionFr) {
    return this.descriptionFr;
  }
  return this.descriptionEn;
};

// Virtual for formatted price
ProductSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF'
  }).format(this.price);
});

// Database indexes for performance
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ nameEn: 'text', nameFr: 'text', descriptionEn: 'text' });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ price: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);