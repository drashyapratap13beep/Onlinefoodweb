import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  MenuItem,
  Order,
  CartItem,
  CategoryId,
  DietaryTag,
  OrderStatus,
  OrderType,
  CategorySalesSummary,
  User,
  CurrencyCode,
} from '../types/bakery';
import { CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_ORDERS } from '../data/bakeryData';

interface BakeryContextType {
  // Authentication & Role
  currentUser: User | null;
  isAdmin: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Currency Control (USD / INR)
  currency: CurrencyCode;
  conversionRate: number;
  setCurrency: (code: CurrencyCode, rate?: number) => void;
  formatPrice: (amountInUSD: number) => string;

  // Storefront & Menu State
  menuItems: MenuItem[];
  categories: typeof CATEGORIES;
  selectedCategory: CategoryId | 'all';
  searchQuery: string;
  dietaryFilter: DietaryTag | 'all';
  selectedItemForDetail: MenuItem | null;
  activeView: 'store' | 'dashboard';
  activeDashboardTab: 'analytics' | 'orders' | 'inventory';
  
  // Cart & Ordering State
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  orderType: OrderType;
  fulfillmentTime: string;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  confirmedOrder: Order | null;
  trackedOrder: Order | null;
  isNewItemModalOpen: boolean;

  // Management & Orders State
  orders: Order[];
  
  // Actions
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  setSearchQuery: (q: string) => void;
  setDietaryFilter: (f: DietaryTag | 'all') => void;
  setActiveView: (view: 'store' | 'dashboard') => void;
  setActiveDashboardTab: (tab: 'analytics' | 'orders' | 'inventory') => void;
  setOrderType: (t: OrderType) => void;
  setFulfillmentTime: (t: string) => void;
  openItemDetail: (item: MenuItem) => void;
  closeItemDetail: () => void;
  addToCart: (
    item: MenuItem,
    quantity: number,
    selectedOptions?: Record<string, string>,
    selectedOptionsDisplay?: string[],
    specialInstructions?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setConfirmedOrder: (order: Order | null) => void;
  setTrackedOrder: (order: Order | null) => void;
  setIsNewItemModalOpen: (open: boolean) => void;
  placeOrder: (orderData: {
    customer: Order['customer'];
    type: OrderType;
    fulfillmentTime: string;
    deliveryAddress?: Order['deliveryAddress'];
    paymentMethod: Order['paymentMethod'];
    tip: number;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleItemStock: (itemId: string) => void;
  updateItemStockCount: (itemId: string, count: number) => void;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'rating' | 'reviewsCount'>) => void;
  deleteDish: (itemId: string) => void;
  updateDish: (itemId: string, updates: Partial<MenuItem>) => void;
  simulateNewOrder: () => Order;
  trackOrderById: (orderId: string) => boolean;
  resetAllDataToDefault: () => void;

  // Analytics Computation
  categoryAnalytics: CategorySalesSummary[];
  totalRevenue: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  topSellingItems: { item: MenuItem; unitsSold: number; revenue: number }[];
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU: 'zaika_darbar_menu_v1',
  ORDERS: 'zaika_darbar_orders_v1',
  CART: 'zaika_darbar_cart_v1',
  USER: 'zaika_darbar_user_v1',
  CURRENCY: 'zaika_darbar_currency_v1',
};

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default to guest / null so user can explicitly login as Admin or Customer
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Currency State - Defaults to INR (₹) as requested
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (saved === 'USD' || saved === 'INR') return saved;
    } catch (e) {
      console.error(e);
    }
    return 'INR';
  });

  const [conversionRate, setConversionRate] = useState<number>(85); // 1 USD = 85 INR

  // Load persisted menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MENU_ITEMS;
  });

  // Load persisted orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  // Load persisted cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Filter & Navigation State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryTag | 'all'>('all');
  const [activeView, setActiveViewState] = useState<'store' | 'dashboard'>('store');
  const [activeDashboardTab, setActiveDashboardTab] = useState<'analytics' | 'orders' | 'inventory'>('analytics');

  // Modals & Drawers
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);

  // Order Fulfillment Settings
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [fulfillmentTime, setFulfillmentTime] = useState('Today at 9:30 AM');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  // Sync with Express / MongoDB API on load if accessible
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setMenuItems(data.data);
        }
      })
      .catch(() => {});

    fetch('/api/config/currency')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.data?.code) {
          setCurrencyState(data.data.code);
          if (data.data.conversionRate) setConversionRate(data.data.conversionRate);
        }
      })
      .catch(() => {});
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  // Currency Formatter Helper
  const formatPrice = (amountInUSD: number): string => {
    if (currency === 'INR') {
      const inrAmount = Math.round(amountInUSD * conversionRate);
      return `₹${inrAmount.toLocaleString('en-IN')}`;
    }
    return `$${amountInUSD.toFixed(2)}`;
  };

  const setCurrency = (code: CurrencyCode, rate?: number) => {
    setCurrencyState(code);
    const effectiveRate = rate || (code === 'INR' ? 85 : 1);
    if (rate) setConversionRate(rate);

    fetch('/api/config/currency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, rate: effectiveRate }),
    }).catch(() => {});
  };

  // Auth Operations
  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setIsLoginModalOpen(false);
        return { success: true };
      }
      return { success: false, message: data.error || 'Invalid credentials' };
    } catch {
      // Fallback local check
      if (
        (email.toLowerCase() === 'admin@zaikadarbar.com' ||
         email.toLowerCase() === 'admin@painetmiel.com' ||
         email.toLowerCase().includes('admin')) &&
        pass === 'admin'
      ) {
        const adminUser: User = {
          id: 'usr-admin-1',
          name: 'Zaika Darbar (Head Chef & Admin)',
          email,
          role: 'admin',
        };
        setCurrentUser(adminUser);
        setIsLoginModalOpen(false);
        return { success: true };
      }
      if (pass.length >= 4) {
        const custUser: User = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: 'customer',
        };
        setCurrentUser(custUser);
        setIsLoginModalOpen(false);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials. Try admin@zaikadarbar.com / admin' };
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setIsLoginModalOpen(false);
        return { success: true };
      }
      return { success: false, message: data.error || 'Registration failed' };
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role: 'customer',
      };
      setCurrentUser(newUser);
      setIsLoginModalOpen(false);
      return { success: true };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    if (activeView === 'dashboard') {
      setActiveViewState('store');
    }
  };

  // Secure View Switcher: ONLY Admin can access dashboard
  const setActiveView = (view: 'store' | 'dashboard') => {
    if (view === 'dashboard') {
      if (!isAdmin) {
        setIsLoginModalOpen(true);
        return;
      }
    }
    setActiveViewState(view);
  };

  // Cart Computed
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [cart]);

  const openItemDetail = (item: MenuItem) => {
    setSelectedItemForDetail(item);
  };

  const closeItemDetail = () => {
    setSelectedItemForDetail(null);
  };

  const addToCart = (
    item: MenuItem,
    quantity: number,
    selectedOptions: Record<string, string> = {},
    selectedOptionsDisplay: string[] = [],
    specialInstructions = ''
  ) => {
    let unitPrice = item.price;
    if (item.customizationOptions) {
      for (const group of item.customizationOptions) {
        const chosenVal = selectedOptions[group.key];
        if (chosenVal) {
          const opt = group.options.find((o) => o.value === chosenVal);
          if (opt?.priceModifier) {
            unitPrice += opt.priceModifier;
          }
        }
      }
    }

    const itemTotal = unitPrice * quantity;
    const cartItemId = `${item.id}-${Object.entries(selectedOptions).sort().map(([k, v]) => `${k}:${v}`).join('-')}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        const existing = next[existingIndex];
        const newQty = existing.quantity + quantity;
        next[existingIndex] = {
          ...existing,
          quantity: newQty,
          itemTotal: (existing.itemTotal / existing.quantity) * newQty,
          specialInstructions: specialInstructions || existing.specialInstructions,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            menuItem: item,
            quantity,
            selectedOptions,
            selectedOptionsDisplay,
            specialInstructions,
            itemTotal,
          },
        ];
      }
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.cartItemId !== cartItemId) return ci;
          const newQty = ci.quantity + delta;
          if (newQty <= 0) return null;
          const unitRate = ci.itemTotal / ci.quantity;
          return {
            ...ci,
            quantity: newQty,
            itemTotal: unitRate * newQty,
          };
        })
        .filter((ci): ci is CartItem => ci !== null);
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderData: {
    customer: Order['customer'];
    type: OrderType;
    fulfillmentTime: string;
    deliveryAddress?: Order['deliveryAddress'];
    paymentMethod: Order['paymentMethod'];
    tip: number;
    notes?: string;
  }): Order => {
    const subtotal = cartSubtotal;
    const tax = Math.round(subtotal * 0.0875 * 100) / 100;
    const deliveryFee = orderData.type === 'delivery' ? 4.99 : 0;
    const total = Math.round((subtotal + tax + deliveryFee + orderData.tip) * 100) / 100;
    const orderNumber = 1043 + orders.length;
    const id = `ZD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id,
      orderNumber,
      customer: orderData.customer,
      type: orderData.type,
      fulfillmentTime: orderData.fulfillmentTime,
      deliveryAddress: orderData.deliveryAddress,
      items: [...cart],
      subtotal,
      tax,
      deliveryFee,
      tip: orderData.tip,
      total,
      status: 'received',
      paymentMethod: orderData.paymentMethod,
      isPaid: true,
      placedAt: new Date().toISOString(),
      notes: orderData.notes,
    };

    setMenuItems((prev) =>
      prev.map((mi) => {
        const orderedItem = cart.find((ci) => ci.menuItem.id === mi.id);
        if (orderedItem) {
          const nextStock = Math.max(0, mi.stockCount - orderedItem.quantity);
          return {
            ...mi,
            stockCount: nextStock,
            inStock: nextStock > 0,
          };
        }
        return mi;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setConfirmedOrder(newOrder);

    // Sync with backend API
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(() => {});

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (trackedOrder?.id === orderId) {
      setTrackedOrder((prev) => (prev ? { ...prev, status } : null));
    }
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const toggleItemStock = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((mi) => {
        if (mi.id !== itemId) return mi;
        const newStock = !mi.inStock;
        const stockCount = newStock ? (mi.stockCount === 0 ? 10 : mi.stockCount) : 0;
        fetch(`/api/menu/${itemId}/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inStock: newStock, stockCount }),
        }).catch(() => {});
        return {
          ...mi,
          inStock: newStock,
          stockCount,
        };
      })
    );
  };

  const updateItemStockCount = (itemId: string, count: number) => {
    setMenuItems((prev) =>
      prev.map((mi) => {
        if (mi.id !== itemId) return mi;
        fetch(`/api/menu/${itemId}/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inStock: count > 0, stockCount: Math.max(0, count) }),
        }).catch(() => {});
        return {
          ...mi,
          stockCount: Math.max(0, count),
          inStock: count > 0,
        };
      })
    );
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id' | 'rating' | 'reviewsCount'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
    };
    setMenuItems((prev) => [newItem, ...prev]);

    fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    }).catch(() => {});
  };

  const deleteDish = (itemId: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    fetch(`/api/menu/${itemId}`, { method: 'DELETE' }).catch(() => {});
  };

  const updateDish = (itemId: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
    fetch(`/api/menu/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  };

  const simulateNewOrder = (): Order => {
    const randomCustomers = [
      { name: 'Priya Sharma', email: 'priya@example.in', phone: '+91 98765 43210' },
      { name: 'Vikram Malhotra', email: 'vikram.m@mumbai.co', phone: '+91 98123 45678' },
      { name: 'Ananya Roy', email: 'ananya.roy@kolkata.org', phone: '+91 97111 22334' },
      { name: 'Kabir Mehta', email: 'kabir.mehta@delhibakes.in', phone: '+91 99999 88888' },
    ];
    const customer = randomCustomers[Math.floor(Math.random() * randomCustomers.length)];
    const chosenItems = [
      menuItems[Math.floor(Math.random() * 4)],
      menuItems[4 + Math.floor(Math.random() * 4)],
    ];
    const simulatedCart: CartItem[] = chosenItems.map((item, idx) => ({
      cartItemId: `sim-${item.id}-${idx}`,
      menuItem: item,
      quantity: Math.floor(Math.random() * 2) + 1,
      selectedOptions: {},
      selectedOptionsDisplay: [],
      itemTotal: item.price * (Math.floor(Math.random() * 2) + 1),
    }));

    const subtotal = simulatedCart.reduce((s, c) => s + c.itemTotal, 0);
    const tax = Math.round(subtotal * 0.0875 * 100) / 100;
    const isDelivery = Math.random() > 0.6;
    const deliveryFee = isDelivery ? 4.99 : 0;
    const tip = Math.round((subtotal * 0.15) * 100) / 100;
    const total = Math.round((subtotal + tax + deliveryFee + tip) * 100) / 100;

    const newOrder: Order = {
      id: `ZD-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: 1045 + orders.length,
      customer,
      type: isDelivery ? 'delivery' : 'pickup',
      fulfillmentTime: 'Today in 25 mins',
      deliveryAddress: isDelivery
        ? {
            street: '12 Indiranagar 100ft Rd',
            city: 'Bengaluru',
            zipCode: '560038',
            instructions: 'Ring doorbell twice',
          }
        : undefined,
      items: simulatedCart,
      subtotal,
      tax,
      deliveryFee,
      tip,
      total,
      status: 'received',
      paymentMethod: 'apple-pay',
      isPaid: true,
      placedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const trackOrderById = (orderId: string): boolean => {
    const cleanId = orderId.trim().toUpperCase().replace('#', '');
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === cleanId ||
        o.id.replace('ZD-', '') === cleanId ||
        o.id.replace('PM-', '') === cleanId
    );
    if (found) {
      setTrackedOrder(found);
      return true;
    }
    return false;
  };

  const resetAllDataToDefault = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  // Category Analytics Calculations
  const categoryAnalytics: CategorySalesSummary[] = useMemo(() => {
    const categoryTotals: Record<string, { revenue: number; unitsSold: number }> = {};
    CATEGORIES.forEach((cat) => {
      categoryTotals[cat.id] = { revenue: 0, unitsSold: 0 };
    });

    let grandTotalRevenue = 0;

    orders.forEach((order) => {
      if (order.status === 'cancelled') return;

      order.items.forEach((item) => {
        const cat = item.menuItem.category;
        if (categoryTotals[cat]) {
          categoryTotals[cat].revenue += item.itemTotal;
          categoryTotals[cat].unitsSold += item.quantity;
          grandTotalRevenue += item.itemTotal;
        }
      });
    });

    return CATEGORIES.map((cat) => {
      const stats = categoryTotals[cat.id] || { revenue: 0, unitsSold: 0 };
      const percentage = grandTotalRevenue > 0
        ? Math.round((stats.revenue / grandTotalRevenue) * 1000) / 10
        : 0;

      return {
        category: cat.id,
        categoryName: cat.name,
        unitsSold: stats.unitsSold,
        revenue: Math.round(stats.revenue * 100) / 100,
        percentage,
        color: cat.color,
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return Math.round(
      orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0) * 100
    ) / 100;
  }, [orders]);

  const totalOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== 'cancelled').length;
  }, [orders]);

  const averageOrderValue = useMemo(() => {
    if (totalOrdersCount === 0) return 0;
    return Math.round((totalRevenue / totalOrdersCount) * 100) / 100;
  }, [totalRevenue, totalOrdersCount]);

  const topSellingItems = useMemo(() => {
    const itemMap: Record<string, { item: MenuItem; unitsSold: number; revenue: number }> = {};

    orders.forEach((order) => {
      if (order.status === 'cancelled') return;
      order.items.forEach((ci) => {
        const id = ci.menuItem.id;
        if (!itemMap[id]) {
          itemMap[id] = { item: ci.menuItem, unitsSold: 0, revenue: 0 };
        }
        itemMap[id].unitsSold += ci.quantity;
        itemMap[id].revenue += ci.itemTotal;
      });
    });

    return Object.values(itemMap).sort((a, b) => b.unitsSold - a.unitsSold);
  }, [orders]);

  return (
    <BakeryContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoginModalOpen,
        setIsLoginModalOpen,
        login,
        register,
        logout,
        currency,
        conversionRate,
        setCurrency,
        formatPrice,
        menuItems,
        categories: CATEGORIES,
        selectedCategory,
        searchQuery,
        dietaryFilter,
        selectedItemForDetail,
        activeView,
        activeDashboardTab,
        cart,
        cartCount,
        cartSubtotal,
        orderType,
        fulfillmentTime,
        isCartOpen,
        isCheckoutOpen,
        confirmedOrder,
        trackedOrder,
        isNewItemModalOpen,
        orders,
        setSelectedCategory,
        setSearchQuery,
        setDietaryFilter,
        setActiveView,
        setActiveDashboardTab,
        setOrderType,
        setFulfillmentTime,
        openItemDetail,
        closeItemDetail,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        setIsCartOpen,
        setIsCheckoutOpen,
        setConfirmedOrder,
        setTrackedOrder,
        setIsNewItemModalOpen,
        placeOrder,
        updateOrderStatus,
        toggleItemStock,
        updateItemStockCount,
        addMenuItem,
        deleteDish,
        updateDish,
        simulateNewOrder,
        trackOrderById,
        resetAllDataToDefault,
        categoryAnalytics,
        totalRevenue,
        totalOrdersCount,
        averageOrderValue,
        topSellingItems,
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
