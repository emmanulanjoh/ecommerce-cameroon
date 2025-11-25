import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchHistory extends Document {
  query: string;
  resultCount: number;
  userId?: string;
  sessionId?: string;
  language: 'en' | 'fr';
  clicked: boolean;
  clickedProductId?: string;
  createdAt: Date;
}

const SearchHistorySchema: Schema = new Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    resultCount: {
      type: Number,
      default: 0
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    sessionId: {
      type: String,
      index: true
    },
    language: {
      type: String,
      enum: ['en', 'fr'],
      default: 'en'
    },
    clicked: {
      type: Boolean,
      default: false
    },
    clickedProductId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  },
  {
    timestamps: true
  }
);

// Index for trending searches
SearchHistorySchema.index({ query: 1, createdAt: -1 });
SearchHistorySchema.index({ createdAt: -1 });

const SearchHistory = mongoose.model<ISearchHistory>('SearchHistory', SearchHistorySchema);

export default SearchHistory;
