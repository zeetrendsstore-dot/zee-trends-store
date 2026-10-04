import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { PRODUCTS } from './src/data/products.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing with 15MB limit for image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// --- SECURE SERVER-SIDE GEMINI CLIENT ---
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// --- SECURE SERVER-SIDE AUTH STORAGE ---
// Admin credentials come from server environment (never exposed to client bundle)
const SERVER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'zeetrendsstore@gmail.com').toLowerCase().trim();
const SERVER_ADMIN_ALT_EMAIL = 'admin@zeetrends.pk';
const SERVER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ZeeTrends2026!Admin';

// In-memory active session tokens with 7-day TTL
interface AdminSession {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}
const activeSessions = new Map<string, AdminSession>();

// Auth Middleware: Enforces that requests have a valid server-issued token
export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Secure Admin access required. Please sign in.' 
    });
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or expired session. Please log in again.' 
    });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Session has expired. Please log in again.' 
    });
  }

  // Session is valid
  (req as any).adminUser = session.email;
  next();
};

// --- AUTH API ROUTES ---

// 1. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const isEmailValid = cleanEmail === SERVER_ADMIN_EMAIL || cleanEmail === SERVER_ADMIN_ALT_EMAIL;
  const isPasswordValid = password === SERVER_ADMIN_PASSWORD;

  if (!isEmailValid || !isPasswordValid) {
    // Artificial delay to prevent brute-force timing attacks
    return setTimeout(() => {
      res.status(401).json({ 
        error: 'Invalid credentials', 
        message: 'Incorrect email or password. Access denied.' 
      });
    }, 400);
  }

  // Generate a cryptographically secure 256-bit token
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

  activeSessions.set(token, {
    token,
    email: cleanEmail,
    createdAt: now,
    expiresAt,
  });

  return res.json({
    success: true,
    message: 'Admin authenticated successfully',
    token,
    email: cleanEmail,
    expiresAt,
  });
});

// 2. Verify Session
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    email: session.email,
  });
});

// 3. Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// --- SERVER-SIDE DATA STORAGE ---
// Pre-populated with initial store products
let serverProducts: any[] = [...PRODUCTS];
let serverLogo: string | null = null;
let serverOrders: any[] = [
  {
    orderId: 'ZT-9482',
    customerName: 'Muhammad Usman Ali',
    phone: '+92 300 1234567',
    email: 'usman@example.com',
    address: 'House #42, Street 8, Sector F-8/2',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    postalCode: '44000',
    notes: 'Please call before arriving',
    paymentMethod: 'cod',
    items: [
      {
        product: PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Champagne Gold'
      }
    ],
    subtotal: 3850,
    discount: 0,
    shipping: 0,
    total: 3850,
    orderDate: 'Oct 3, 2026 at 3:45 PM',
    status: 'In-Transit',
    trackingNumber: 'TRAX-PK92481029'
  }
];

// Helper: sanitized catalog for AI context (strictly public data, no private margins or admin fields)
const getPublicCatalogSummary = () => {
  return serverProducts.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    shortDesc: p.shortDesc,
    description: p.description,
    inStock: p.inStock,
    colors: p.colors || [],
    rating: p.rating,
    tags: p.tags || []
  }));
};

// --- PUBLIC & PROTECTED PRODUCT APIS ---

// Public: Get Products (read-only for customers)
app.get('/api/products', (req: Request, res: Response) => {
  res.json({ products: serverProducts, count: serverProducts.length });
});

// Public: Get Store Logo
app.get('/api/store-logo', (req: Request, res: Response) => {
  res.json({ logo: serverLogo });
});

// Protected: Add Product (Admin Only)
app.post('/api/products', requireAdminAuth, (req: Request, res: Response) => {
  const productData = req.body;
  if (!productData || !productData.title) {
    return res.status(400).json({ error: 'Product title is required' });
  }

  const id = productData.id || `zt-${Date.now().toString().slice(-6)}`;
  const slug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newProduct = {
    ...productData,
    id,
    slug: slug || id,
    discountPercent: productData.originalPrice > productData.price
      ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
      : 0
  };

  serverProducts = [newProduct, ...serverProducts];
  return res.status(201).json({ success: true, product: newProduct });
});

// Protected: Update Product (Admin Only)
app.put('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const index = serverProducts.findIndex((p) => p.id === id);
  if (index === -1) {
    serverProducts.push({ id, ...updates });
  } else {
    serverProducts[index] = { ...serverProducts[index], ...updates };
  }

  return res.json({ success: true, message: 'Product updated on server' });
});

// Protected: Delete Product (Admin Only)
app.delete('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  serverProducts = serverProducts.filter((p) => p.id !== id);
  return res.json({ success: true, message: `Product ${id} deleted from server` });
});

// Protected: Update Store Logo (Admin Only)
app.post('/api/admin/logo', requireAdminAuth, (req: Request, res: Response) => {
  const { logo } = req.body;
  serverLogo = logo || null;
  return res.json({ success: true, message: 'Store logo updated on server' });
});

// Protected: View All Customer Orders (Admin Only)
app.get('/api/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  return res.json({ orders: serverOrders });
});

// Protected: Update Order Status (Admin Only)
app.patch('/api/admin/orders/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = serverOrders.find((o) => o.orderId === id);
  if (order) {
    order.status = status;
    return res.json({ success: true, order });
  }
  return res.status(404).json({ error: 'Order not found' });
});

// Protected: Delete Order (Admin Only)
app.delete('/api/admin/orders/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  serverOrders = serverOrders.filter((o) => o.orderId !== id);
  return res.json({ success: true, message: `Order ${id} deleted` });
});

// Public: Place Order (Customer checkout)
app.post('/api/orders', (req: Request, res: Response) => {
  const orderData = req.body;
  if (!orderData || !orderData.customerName || !orderData.phone) {
    return res.status(400).json({ error: 'Incomplete order details' });
  }

  const orderId = `ZT-${Math.floor(1000 + Math.random() * 9000)}`;
  const trackingNumber = `TRAX-PK${Math.floor(10000000 + Math.random() * 90000000)}`;
  const now = new Date();
  const orderDate = `${now.toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}`;

  const newOrder = {
    ...orderData,
    orderId,
    status: 'Booked',
    trackingNumber,
    orderDate,
  };

  serverOrders = [newOrder, ...serverOrders];
  return res.status(201).json({ success: true, order: newOrder });
});

// --- USEFUL AI FEATURES FOR SHOPPERS ---

// 1. AI Shopping Assistant (General Q&A, product discovery, budget recommendations)
app.post('/api/ai/shopping-assistant', async (req: Request, res: Response) => {
  const { messages, currentProductId } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const catalog = getPublicCatalogSummary();
  const currentProduct = currentProductId ? catalog.find((p) => p.id === currentProductId) : null;

  const systemInstruction = `You are the official AI Shopping Assistant for ZEE TRENDS STORE, Pakistan's trusted online store.
Your goal is to help Pakistani shoppers discover products, choose the right gift, or find items matching their budget, preferences, and style.

CRITICAL RULES:
1. ONLY recommend products that actually exist in our store catalog provided below. Do not make up products or features.
2. Quote all prices in Pakistani Rupees (PKR / Rs., e.g., "Rs. 2,499").
3. Remind customers we offer Cash on Delivery (COD) across Pakistan, 7-day replacement warranty, and free delivery on orders over Rs. 3,500.
4. Keep answers friendly, welcoming (e.g. "Assalam-o-Alaikum!"), concise, and focused on helping the shopper buy or decide.
5. At the end of your response, if you recommend or discuss specific products from our catalog, append a list of their product IDs in the exact format:
[SUGGESTIONS: id1, id2]
(e.g., "[SUGGESTIONS: zt-002, zt-007]"). This allows our web app to render interactive clickable cards.

STORE CATALOG:
${JSON.stringify(catalog, null, 2)}

${currentProduct ? `The customer is currently looking at this product: ${JSON.stringify(currentProduct)}` : ''}`;

  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured on server');
    }

    // Format chat turns for Gemini API
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const rawText = response.text || "Assalam-o-Alaikum! How can I help you find the right product today?";
    
    // Extract suggestions tag if present
    const suggestionMatch = rawText.match(/\[SUGGESTIONS:\s*([^\]]+)\]/i);
    let suggestedIds: string[] = [];
    let cleanText = rawText;

    if (suggestionMatch) {
      suggestedIds = suggestionMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter((id) => catalog.some((p) => p.id === id));
      cleanText = rawText.replace(/\[SUGGESTIONS:\s*[^\]]+\]/i, '').trim();
    } else {
      // Auto-detect product IDs mentioned in the text
      suggestedIds = catalog
        .filter((p) => rawText.toLowerCase().includes(p.title.toLowerCase()) || rawText.includes(p.id))
        .map((p) => p.id)
        .slice(0, 3);
    }

    return res.json({
      text: cleanText,
      suggestedProductIds: suggestedIds
    });
  } catch (error: any) {
    console.warn('[AI Assistant Fallback]', error?.message || error);

    // Graceful smart fallback using catalog heuristics
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const query = lastUserMessage.toLowerCase();

    // Check for budget mentions (e.g., "under 2000", "under 3000", "below 2500")
    const budgetMatch = query.match(/(?:under|below|less than|upto|up to)\s*(?:rs\.?|pkr)?\s*(\d+)/i);
    const maxBudget = budgetMatch ? parseInt(budgetMatch[1], 10) : null;

    let matched = catalog.filter((p) => {
      if (maxBudget && p.price > maxBudget) return false;
      const titleMatch = p.title.toLowerCase().includes(query);
      const catMatch = p.category.toLowerCase().includes(query);
      const tagMatch = p.tags?.some((t: string) => query.includes(t.toLowerCase()));
      const wordMatch = query.split(' ').some((word: string) => word.length > 3 && p.title.toLowerCase().includes(word));
      return titleMatch || catMatch || tagMatch || wordMatch;
    });

    if (matched.length === 0) {
      matched = catalog.filter((p) => p.price <= (maxBudget || 3000)).slice(0, 3);
    }

    const suggestedIds = matched.slice(0, 3).map((p) => p.id);
    const sampleTitles = matched.slice(0, 2).map((p) => `*${p.title}* (Rs. ${p.price.toLocaleString()})`).join(' and ');

    const fallbackResponse = `Assalam-o-Alaikum! Based on our actual store catalog, here are our recommended options for you: ${sampleTitles || 'our top trending items'}. We offer nationwide Cash on Delivery across Pakistan and free delivery on orders over Rs. 3,500. Click on any card below to view full details or order directly!`;

    return res.json({
      text: fallbackResponse,
      suggestedProductIds: suggestedIds
    });
  }
});

// 2. AI Natural-Language Product Search
app.post('/api/ai/smart-search', async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const catalog = getPublicCatalogSummary();

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured on server');
    }

    const prompt = `You are a product search engine for an Pakistani e-commerce store.
The customer typed this natural-language query: "${query}"

Here is our entire product catalog:
${JSON.stringify(catalog.map((p) => ({ id: p.id, title: p.title, category: p.category, price: p.price, shortDesc: p.shortDesc, tags: p.tags })))}

Analyze the customer's intent (e.g. category, budget constraint in PKR, skin problem, gift recipient, style, utility).
Select all products that match this query. Order them by best relevance.
Generate a concise, 1-sentence friendly explanation of what you found.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of matching product IDs from catalog'
            },
            explanation: {
              type: Type.STRING,
              description: 'Short 1-sentence explanation of results'
            }
          },
          required: ['productIds', 'explanation']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const validIds = (parsed.productIds || []).filter((id: string) => catalog.some((p) => p.id === id));

    return res.json({
      productIds: validIds,
      explanation: parsed.explanation || `Found ${validIds.length} items matching "${query}".`
    });
  } catch (error: any) {
    console.warn('[AI Search Fallback]', error?.message || error);

    // Heuristic natural language parsing fallback
    const q = query.toLowerCase();
    const budgetMatch = q.match(/(?:under|below|less than|upto|up to)\s*(?:rs\.?|pkr)?\s*(\d+)/i);
    const maxBudget = budgetMatch ? parseInt(budgetMatch[1], 10) : null;

    const matched = catalog.filter((p) => {
      if (maxBudget && p.price > maxBudget) return false;
      const terms = q.replace(/(?:under|below|less than|upto|up to|rs\.?|pkr|\d+)/gi, '').trim().split(/\s+/).filter((w) => w.length > 2);
      if (terms.length === 0) return true;
      return terms.some((term) => 
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.shortDesc.toLowerCase().includes(term) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(term))
      );
    });

    const productIds = matched.map((p) => p.id);
    const explanation = maxBudget 
      ? `Found ${productIds.length} products matching your request under Rs. ${maxBudget.toLocaleString()}.`
      : `Found ${productIds.length} products matching "${query}".`;

    return res.json({
      productIds,
      explanation
    });
  }
});

// --- VITE MIDDLEWARE & STATIC ASSET SERVING ---
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Server] ZEE TRENDS STORE full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error] Failed to start:', err);
});
