import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'whatsapp' | 'cash_on_delivery' | 'mobile_money' | 'bank_transfer';
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    region: string;
    country: string;
  };
  whatsappOrderId?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      image: String
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['whatsapp', 'cash_on_delivery', 'mobile_money', 'bank_transfer'],
      default: 'whatsapp'
    },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String, required: true },
      country: { type: String, default: 'Cameroon' }
    },
    whatsappOrderId: String,
    notes: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date
  },
  {
    timestamps: true
  }
);

// Indexes for performance
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ whatsappOrderId: 1 });

export default mongoose.model<IOrder>('Order', OrderSchema);