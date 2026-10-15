export type CategoryId = 
  | 'biryani-rice' 
  | 'curries-gravies' 
  | 'tandoor-starters' 
  | 'breads-kulcha' 
  | 'mithai-desserts' 
  | 'beverages-lassi'
  | 'artisan-bread' 
  | 'viennoiserie' 
  | 'pastries-cakes' 
  | 'savory-quiche' 
  | 'specialty-coffee' 
  | 'seasonal-specials';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  tagline: string;
  iconName: string;
  color: string;
}

export type DietaryTag = 
  | '100% Eggless'
  | 'Contains Egg'
  | 'Jain Friendly'
  | 'Vegan' 
  | 'Gluten-Free' 
  | 'Nut-Free' 
  | 'Best Seller' 
  | 'Chef Choice' 
  | 'Organic Flour';

export interface CustomizationOption {
  title: string;
  key: string;
  options: {
    label: string;
    value: string;
    priceModifier?: number;
  }[];
}

export interface MenuItem {
  id: string;
  name: string;
  hindiSubName?: string;
  frenchSubName?: string;
  category: CategoryId;
  description: string;
  price: number;
  imageUrl: string;
  dietaryTags: DietaryTag[];
  isEggless?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  bakingScheduleNote?: string;
  inStock: boolean;
  stockCount: number;
  ingredients: string[];
  allergens: string[];
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  customizationOptions?: CustomizationOption[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: Record<string, string>;
  selectedOptionsDisplay: string[];
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderStatus = 'received' | 'in-oven' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'pickup' | 'delivery';
export type PaymentMethod = 'upi' | 'card' | 'cod' | 'apple-pay' | 'counter';

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  street: string;
  aptOrSuite?: string;
  city: string;
  zipCode: string;
  instructions?: string;
}

export interface Order {
  id: string; // e.g. "ZD-2026-8941"
  orderNumber: number;
  customer: OrderCustomer;
  type: OrderType;
  fulfillmentTime: string; // e.g., "Today at 9:30 AM"
  deliveryAddress?: DeliveryAddress;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  placedAt: string; // ISO string
  notes?: string;
}

export interface CategorySalesSummary {
  category: CategoryId;
  categoryName: string;
  unitsSold: number;
  revenue: number;
  percentage: number;
  color: string;
}

export type CurrencyCode = 'INR' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  conversionRate: number; // e.g., 1 USD = 85 INR
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}
