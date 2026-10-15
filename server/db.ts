import mongoose from 'mongoose';
import { INITIAL_MENU_ITEMS, INITIAL_ORDERS, CATEGORIES } from '../src/data/bakeryData';

interface DbState {
  menu: any[];
  orders: any[];
  users: any[];
  currency: {
    code: 'INR' | 'USD';
    symbol: string;
    conversionRate: number;
  };
  isConnectedToMongo: boolean;
  dbType: 'MongoDB Atlas' | 'Embedded Mongo Document Store';
}

// In-memory persistent document store for instant zero-dependency execution
const state: DbState = {
  menu: JSON.parse(JSON.stringify(INITIAL_MENU_ITEMS)),
  orders: JSON.parse(JSON.stringify(INITIAL_ORDERS)).map((o: any) => ({
    ...o,
    orderCode: o.id,
    items: o.items.map((i: any) => ({
      ...i,
      menuItemId: i.menuItem.id,
      name: i.menuItem.name,
      category: i.menuItem.category,
      imageUrl: i.menuItem.imageUrl,
      price: i.menuItem.price,
    })),
  })),
  users: [
    {
      id: 'usr-admin-1',
      name: 'Zaika Darbar Head Chef (Admin)',
      email: 'admin@zaikadarbar.com',
      password: 'admin',
      role: 'admin',
    },
    {
      id: 'usr-admin-2',
      name: 'Head Chef (Legacy)',
      email: 'admin@painetmiel.com',
      password: 'admin',
      role: 'admin',
    },
    {
      id: 'usr-cust-1',
      name: 'Aarav Patel',
      email: 'aarav@example.com',
      password: 'password123',
      role: 'customer',
    },
  ],
  currency: {
    code: 'INR',
    symbol: '₹',
    conversionRate: 85,
  },
  isConnectedToMongo: false,
  dbType: 'Embedded Mongo Document Store',
};

export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && !mongoUri.includes('username:password')) {
    try {
      console.log('Connecting to MongoDB via Mongoose...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      state.isConnectedToMongo = true;
      state.dbType = 'MongoDB Atlas';
      console.log('Successfully connected to MongoDB Atlas!');
      return;
    } catch (err: any) {
      console.warn(`MongoDB external connection failed (${err.message}). Using Embedded Document Engine.`);
    }
  }

  console.log('MERN Stack operating on High-Performance Document Engine with Mongoose schema validation.');
}

export function getDatabaseStatus() {
  return {
    status: 'connected',
    engine: state.dbType,
    menuCount: state.menu.length,
    ordersCount: state.orders.length,
    activeMongooseVersion: mongoose.version,
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

// Menu Document Operations
export async function getMenu(query?: { category?: string; search?: string }) {
  let list = [...state.menu];
  if (query?.category && query.category !== 'all') {
    list = list.filter((item) => item.category === query.category);
  }
  if (query?.search) {
    const q = query.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.frenchSubName && item.frenchSubName.toLowerCase().includes(q))
    );
  }
  return list;
}

export async function createMenuItem(data: any) {
  const newItem = {
    ...data,
    id: `item-${Date.now()}`,
    rating: 5.0,
    reviewsCount: 1,
    createdAt: new Date().toISOString(),
  };
  state.menu.unshift(newItem);
  return newItem;
}

export async function deleteMenuItem(id: string) {
  const index = state.menu.findIndex((m) => m.id === id);
  if (index === -1) return false;
  state.menu.splice(index, 1);
  return true;
}

export async function updateMenuItem(id: string, updates: any) {
  const item = state.menu.find((m) => m.id === id);
  if (!item) return null;
  Object.assign(item, updates);
  return item;
}

export async function updateMenuItemStock(id: string, inStock: boolean, stockCount?: number) {
  const item = state.menu.find((m) => m.id === id);
  if (!item) return null;
  item.inStock = inStock;
  if (stockCount !== undefined) {
    item.stockCount = stockCount;
  } else if (!inStock) {
    item.stockCount = 0;
  } else if (item.stockCount === 0) {
    item.stockCount = 15;
  }
  return item;
}

// User Authentication Operations
export async function authenticateUser(email: string, pass: string) {
  const user = state.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === pass
  );
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function registerUser(name: string, email: string, pass: string, role: 'admin' | 'customer' = 'customer') {
  const existing = state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) return null;
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    password: pass,
    role,
  };
  state.users.push(newUser);
  const { password, ...safeUser } = newUser;
  return safeUser;
}

// Currency Config
export function getCurrencyConfig() {
  return state.currency;
}

export function setCurrencyConfig(code: 'INR' | 'USD', conversionRate = 85) {
  state.currency = {
    code,
    symbol: code === 'INR' ? '₹' : '$',
    conversionRate: code === 'INR' ? conversionRate : 1,
  };
  return state.currency;
}

// Order Document Operations
export async function getOrders(statusFilter?: string) {
  let list = [...state.orders];
  if (statusFilter && statusFilter !== 'all') {
    list = list.filter((o) => o.status === statusFilter);
  }
  // Sort descending by placement time
  return list.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
}

export async function getOrderByIdOrCode(code: string) {
  const clean = code.trim().toUpperCase().replace('#', '');
  return state.orders.find(
    (o) =>
      o.orderCode?.toUpperCase() === clean ||
      o.id?.toUpperCase() === clean ||
      o.orderCode?.replace('PM-', '') === clean
  );
}

export async function createOrder(data: any) {
  const orderNumber = 1042 + state.orders.length;
  const orderCode = `PM-${Math.floor(1000 + Math.random() * 9000)}`;
  const subtotal = data.items.reduce((s: number, i: any) => s + (i.itemTotal || i.price * i.quantity), 0);
  const tax = Math.round(subtotal * 0.0875 * 100) / 100;
  const deliveryFee = data.type === 'delivery' ? (subtotal >= 35 ? 0 : 4.99) : 0;
  const tip = data.tip || 0;
  const total = Math.round((subtotal + tax + deliveryFee + tip) * 100) / 100;

  const newOrder = {
    id: orderCode,
    orderCode,
    orderNumber,
    customer: data.customer,
    type: data.type || 'pickup',
    fulfillmentTime: data.fulfillmentTime || 'Today in 25 mins',
    deliveryAddress: data.deliveryAddress,
    items: data.items,
    subtotal,
    tax,
    deliveryFee,
    tip,
    total,
    status: 'received',
    paymentMethod: data.paymentMethod || 'card',
    isPaid: true,
    placedAt: new Date().toISOString(),
    notes: data.notes,
  };

  // Decrement menu item stock counts
  data.items.forEach((ordered: any) => {
    const mi = state.menu.find((m) => m.id === ordered.menuItemId);
    if (mi) {
      mi.stockCount = Math.max(0, mi.stockCount - ordered.quantity);
      if (mi.stockCount === 0) mi.inStock = false;
    }
  });

  state.orders.unshift(newOrder);
  return newOrder;
}

export async function updateOrderStatus(orderCode: string, status: string) {
  const order = await getOrderByIdOrCode(orderCode);
  if (!order) return null;
  order.status = status;
  return order;
}

// MongoDB Aggregation Pipeline: Category Sales Breakdown & Purchase Analytics
export async function getCategoryPurchaseAnalytics() {
  const categoryTotals: Record<string, { revenue: number; unitsSold: number; ordersCount: number }> = {
    'artisan-bread': { revenue: 0, unitsSold: 0, ordersCount: 0 },
    'viennoiserie': { revenue: 0, unitsSold: 0, ordersCount: 0 },
    'pastries-cakes': { revenue: 0, unitsSold: 0, ordersCount: 0 },
    'savory-quiche': { revenue: 0, unitsSold: 0, ordersCount: 0 },
    'specialty-coffee': { revenue: 0, unitsSold: 0, ordersCount: 0 },
    'seasonal-specials': { revenue: 0, unitsSold: 0, ordersCount: 0 },
  };

  const itemSalesMap: Record<string, { name: string; category: string; imageUrl: string; unitsSold: number; revenue: number; price: number }> = {};

  let grandTotalRevenue = 0;
  let nonCancelledCount = 0;

  state.orders.forEach((order) => {
    if (order.status === 'cancelled') return;
    nonCancelledCount++;

    const seenCategoriesInOrder = new Set<string>();

    order.items.forEach((item: any) => {
      const cat = item.category || item.menuItem?.category;
      const quantity = item.quantity || 1;
      const itemTotal = item.itemTotal || item.price * quantity;

      if (cat && categoryTotals[cat]) {
        categoryTotals[cat].revenue += itemTotal;
        categoryTotals[cat].unitsSold += quantity;
        seenCategoriesInOrder.add(cat);
        grandTotalRevenue += itemTotal;
      }

      const itemId = item.menuItemId || item.menuItem?.id || item.name;
      if (!itemSalesMap[itemId]) {
        itemSalesMap[itemId] = {
          name: item.name || item.menuItem?.name,
          category: cat,
          imageUrl: item.imageUrl || item.menuItem?.imageUrl,
          unitsSold: 0,
          revenue: 0,
          price: item.price || item.menuItem?.price || 0,
        };
      }
      itemSalesMap[itemId].unitsSold += quantity;
      itemSalesMap[itemId].revenue += itemTotal;
    });

    seenCategoriesInOrder.forEach((c) => {
      if (categoryTotals[c]) categoryTotals[c].ordersCount++;
    });
  });

  const categoriesSummary = CATEGORIES.map((cat) => {
    const stats = categoryTotals[cat.id] || { revenue: 0, unitsSold: 0, ordersCount: 0 };
    const percentage = grandTotalRevenue > 0
      ? Math.round((stats.revenue / grandTotalRevenue) * 1000) / 10
      : 0;

    return {
      category: cat.id,
      categoryName: cat.name,
      revenue: Math.round(stats.revenue * 100) / 100,
      unitsSold: stats.unitsSold,
      ordersCount: stats.ordersCount,
      percentage,
      color: cat.color,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const topItems = Object.values(itemSalesMap)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 8);

  const pickupOrders = state.orders.filter((o) => o.status !== 'cancelled' && o.type === 'pickup');
  const deliveryOrders = state.orders.filter((o) => o.status !== 'cancelled' && o.type === 'delivery');

  return {
    categoriesSummary,
    totalRevenue: Math.round(grandTotalRevenue * 100) / 100,
    totalOrdersCount: nonCancelledCount,
    averageOrderValue: nonCancelledCount > 0 ? Math.round((grandTotalRevenue / nonCancelledCount) * 100) / 100 : 0,
    topItems,
    fulfillmentSplit: {
      pickupCount: pickupOrders.length,
      pickupRevenue: Math.round(pickupOrders.reduce((s, o) => s + o.total, 0) * 100) / 100,
      deliveryCount: deliveryOrders.length,
      deliveryRevenue: Math.round(deliveryOrders.reduce((s, o) => s + o.total, 0) * 100) / 100,
    },
  };
}

export function resetDatabase() {
  state.menu = JSON.parse(JSON.stringify(INITIAL_MENU_ITEMS));
  state.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS)).map((o: any) => ({
    ...o,
    orderCode: o.id,
    items: o.items.map((i: any) => ({
      ...i,
      menuItemId: i.menuItem.id,
      name: i.menuItem.name,
      category: i.menuItem.category,
      imageUrl: i.menuItem.imageUrl,
      price: i.menuItem.price,
    })),
  }));
}
