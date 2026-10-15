import { Router, Request, Response } from 'express';
import {
  getMenu,
  createMenuItem,
  deleteMenuItem,
  updateMenuItem,
  updateMenuItemStock,
  getOrders,
  getOrderByIdOrCode,
  createOrder,
  updateOrderStatus,
  getCategoryPurchaseAnalytics,
  getDatabaseStatus,
  resetDatabase,
  authenticateUser,
  registerUser,
  getCurrencyConfig,
  setCurrencyConfig,
} from '../db';

export const apiRouter = Router();

// MERN Stack Status & MongoDB Healthcheck
apiRouter.get('/status', (req: Request, res: Response) => {
  const dbStatus = getDatabaseStatus();
  res.json({
    stack: 'MERN (MongoDB, Express, React, Node.js)',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Authentication Endpoints
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password required' });
    }
    const user = await registerUser(name, email, password, role || 'customer');
    if (!user) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }
    res.status(201).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Currency Config Endpoints
apiRouter.get('/config/currency', (req: Request, res: Response) => {
  res.json({ success: true, data: getCurrencyConfig() });
});

apiRouter.post('/config/currency', (req: Request, res: Response) => {
  const { code, rate } = req.body;
  if (!code || (code !== 'INR' && code !== 'USD')) {
    return res.status(400).json({ success: false, error: 'Currency code must be INR or USD' });
  }
  const updated = setCurrencyConfig(code, rate ? parseFloat(rate) : 85);
  res.json({ success: true, data: updated });
});

// Menu Endpoints
apiRouter.get('/menu', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const items = await getMenu({ category, search });
    res.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/menu', async (req: Request, res: Response) => {
  try {
    const { name, category, price, description, imageUrl, ingredients } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ success: false, error: 'Name, category, and price are required.' });
    }
    const item = await createMenuItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.delete('/menu/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteMenuItem(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.put('/menu/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateMenuItem(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.patch('/menu/:id/stock', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { inStock, stockCount } = req.body;
    const item = await updateMenuItemStock(id, inStock, stockCount);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Orders Endpoints
apiRouter.get('/orders', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const orders = await getOrders(status);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/orders/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const order = await getOrderByIdOrCode(code);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order #${code} not found` });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const { customer, items } = req.body;
    if (!customer?.name || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Customer information and items required.' });
    }
    const newOrder = await createOrder(req.body);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.patch('/orders/:code/status', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }
    const order = await updateOrderStatus(code, status);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order #${code} not found` });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Category Purchase Analytics Endpoint (MongoDB Aggregation)
apiRouter.get('/analytics/category-sales', async (req: Request, res: Response) => {
  try {
    const analytics = await getCategoryPurchaseAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simulate incoming order
apiRouter.post('/orders/simulate', async (req: Request, res: Response) => {
  try {
    const menu = await getMenu();
    const randomCustomers = [
      { name: 'Claire Dufour', email: 'c.dufour@example.com', phone: '(415) 555-8821' },
      { name: 'Lucas Martin', email: 'luke.m@baymail.org', phone: '(415) 555-4921' },
      { name: 'Chloe Dubois', email: 'chloe.dubois@sf.org', phone: '(415) 555-1209' },
    ];
    const customer = randomCustomers[Math.floor(Math.random() * randomCustomers.length)];
    const chosen1 = menu[Math.floor(Math.random() * 4)];
    const chosen2 = menu[4 + Math.floor(Math.random() * 4)];

    const items = [
      {
        menuItemId: chosen1.id,
        name: chosen1.name,
        category: chosen1.category,
        imageUrl: chosen1.imageUrl,
        price: chosen1.price,
        quantity: Math.floor(Math.random() * 2) + 1,
        itemTotal: chosen1.price * (Math.floor(Math.random() * 2) + 1),
      },
      {
        menuItemId: chosen2.id,
        name: chosen2.name,
        category: chosen2.category,
        imageUrl: chosen2.imageUrl,
        price: chosen2.price,
        quantity: 1,
        itemTotal: chosen2.price,
      },
    ];

    const isDelivery = Math.random() > 0.5;
    const newOrder = await createOrder({
      customer,
      items,
      type: isDelivery ? 'delivery' : 'pickup',
      fulfillmentTime: 'Today in 25-30 mins',
      deliveryAddress: isDelivery
        ? { street: '380 Hayes St', city: 'San Francisco', zipCode: '94102' }
        : undefined,
      paymentMethod: 'apple-pay',
      tip: 3.50,
      notes: 'Customer simulated order via live testing tool',
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset database
apiRouter.post('/reset', (req: Request, res: Response) => {
  resetDatabase();
  res.json({ success: true, message: 'Database reset to default sample bakes and orders.' });
});
