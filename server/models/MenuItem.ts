import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomizationOption {
  title: string;
  key: string;
  options: {
    label: string;
    value: string;
    priceModifier?: number;
  }[];
}

export interface IMenuItem extends Document {
  name: string;
  frenchSubName?: string;
  category: 'artisan-bread' | 'viennoiserie' | 'pastries-cakes' | 'savory-quiche' | 'specialty-coffee' | 'seasonal-specials';
  description: string;
  price: number;
  imageUrl: string;
  dietaryTags: string[];
  bakingScheduleNote?: string;
  inStock: boolean;
  stockCount: number;
  ingredients: string[];
  allergens: string[];
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  customizationOptions?: ICustomizationOption[];
  createdAt: Date;
  updatedAt: Date;
}

export const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    frenchSubName: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['artisan-bread', 'viennoiserie', 'pastries-cakes', 'savory-quiche', 'specialty-coffee', 'seasonal-specials'],
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    dietaryTags: [{ type: String }],
    bakingScheduleNote: { type: String },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 20, min: 0 },
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    reviewsCount: { type: Number, default: 1 },
    customizationOptions: [
      {
        title: String,
        key: String,
        options: [
          {
            label: String,
            value: String,
            priceModifier: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Virtual for id string
MenuItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
MenuItemSchema.set('toJSON', { virtuals: true });
MenuItemSchema.set('toObject', { virtuals: true });

export const MenuItem = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
