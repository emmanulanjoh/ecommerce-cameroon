import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchIndex extends Document {
  productId: mongoose.Types.ObjectId;
  searchText: string;
  category: string;
  price: number;
  inStock: boolean;
  tags: string[];
  popularity: number;
  lastUpdated: Date;
}

const SearchIndexSchema = new Schema<ISearchIndex>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  searchText: {
    type: String,
    required: true,
    index: 'text'
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  inStock: {
    type: Boolean,
    required: true,
    index: true
  },
  tags: [{
    type: String,
    index: true
  }],
  popularity: {
    type: Number,
    default: 0,
    index: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

SearchIndexSchema.index({ searchText: 'text' });
SearchIndexSchema.index({ category: 1, price: 1 });
SearchIndexSchema.index({ popularity: -1 });

export const SearchIndex = mongoose.model<ISearchIndex>('SearchIndex', SearchIndexSchema);