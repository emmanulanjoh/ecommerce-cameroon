import mongoose, { Document, Schema } from 'mongoose';

export interface IUserActivity extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  productId: mongoose.Types.ObjectId;
  action: 'view' | 'cart' | 'purchase' | 'wishlist';
  timestamp: Date;
  metadata?: any;
}

const UserActivitySchema = new Schema<IUserActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: ['view', 'cart', 'purchase', 'wishlist'],
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: Schema.Types.Mixed
});

UserActivitySchema.index({ userId: 1, timestamp: -1 });
UserActivitySchema.index({ sessionId: 1, timestamp: -1 });
UserActivitySchema.index({ productId: 1, action: 1 });

export const UserActivity = mongoose.model<IUserActivity>('UserActivity', UserActivitySchema);