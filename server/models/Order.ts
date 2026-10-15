import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  menuItemId: string;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
  selectedOptionsDisplay?: string[];
  specialInstructions?: string;
  itemTotal: number;
}

export interface IOrder extends Document {
  orderCode: string; // e.g. "PM-9241"
  orderNumber: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  type: 'pickup' | 'delivery';
  fulfillmentTime: string;
  deliveryAddress?: {
    street: string;
    aptOrSuite?: string;
    city: string;
    zipCode: string;
    instructions?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  status: 'received' | 'in-oven' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'card' | 'apple-pay' | 'counter';
  isPaid: boolean;
  placedAt: Date;
  notes?: string;
}

export const OrderSchema = new Schema<IOrder>(
  {
    orderCode: { type: String, required: true, unique: true },
    orderNumber: { type: Number, required: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    type: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
    fulfillmentTime: { type: String, required: true },
    deliveryAddress: {
      street: String,
      aptOrSuite: String,
      city: String,
      zipCode: String,
      instructions: String,
    },
    items: [
      {
        menuItemId: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        imageUrl: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        selectedOptions: { type: Map, of: String },
        selectedOptionsDisplay: [String],
        specialInstructions: String,
        itemTotal: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    tip: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['received', 'in-oven', 'ready', 'completed', 'cancelled'],
      default: 'received',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'apple-pay', 'counter'],
      default: 'card',
    },
    isPaid: { type: Boolean, default: true },
    placedAt: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true }
);

OrderSchema.virtual('id').get(function () {
  return this.orderCode;
});
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
