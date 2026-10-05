import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PRODUCTS, Review, INITIAL_REVIEWS } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface PlacedOrder {
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  province?: string;
  postalCode?: string;
  notes?: string;
  paymentMethod: 'cod' | 'bank_transfer';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  orderDate: string;
  status: 'Booked' | 'Dispatched' | 'In-Transit' | 'Delivered';
  trackingNumber: string;
}

interface StoreContextType {
  // Admin Authentication
  isAdminAuthenticated: boolean;
  adminUser: string | null;
  adminToken: string | null;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  openAdminPortal: () => void;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => Promise<void>;

  // Products Management (Editable)
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'discountPercent'> & { id?: string; discountPercent?: number }) => Promise<Product>;
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProducts: () => void;

  // Store Logo
  storeLogo: string | null;
  updateStoreLogo: (logoUri: string) => Promise<void>;
  removeStoreLogo: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  total: number;
  freeShippingProgress: number;
  freeShippingRemaining: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Quick View / PDP
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Navigation & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  activePolicyModal: 'shipping' | 'return' | 'privacy' | 'terms' | null;
  setActivePolicyModal: (policy: 'shipping' | 'return' | 'privacy' | 'terms' | null) => void;

  activeTab: 'home' | 'products' | 'about' | 'contact' | 'track-order' | 'checkout';
  setActiveTab: (tab: 'home' | 'products' | 'about' | 'contact' | 'track-order' | 'checkout') => void;

  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Orders
  orders: PlacedOrder[];
  placeOrder: (orderData: Omit<PlacedOrder, 'orderId' | 'status' | 'trackingNumber' | 'orderDate'>) => PlacedOrder;
  updateOrderStatus: (orderId: string, status: PlacedOrder['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 3500;
const STANDARD_SHIPPING_FEE = 199;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('zt_admin_token') || localStorage.getItem('zt_admin_token');
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('zt_admin_user') || localStorage.getItem('zt_admin_user');
    } catch {
      return null;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(!!adminToken);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // 1. Products editable state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zt_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return PRODUCTS;
  });

  // 2. Custom Store Logo
  const [storeLogo, setStoreLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('zt_store_logo');
    } catch {
      return null;
    }
  });

  // 3. Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zt_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zt_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Orders
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('zt_orders');
      if (saved) return JSON.parse(saved);
      return [
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
    } catch {
      return [];
    }
  });

  // 6. Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('zt_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Modals & UI States
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<'shipping' | 'return' | 'privacy' | 'terms' | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'about' | 'contact' | 'track-order' | 'checkout'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Verify server token on mount
  useEffect(() => {
    if (adminToken) {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      })
      .then((res) => {
        if (!res.ok) throw new Error('Session invalid');
        return res.json();
      })
      .then((data) => {
        if (data.authenticated) {
          setIsAdminAuthenticated(true);
        } else {
          setAdminToken(null);
          setIsAdminAuthenticated(false);
          sessionStorage.removeItem('zt_admin_token');
          localStorage.removeItem('zt_admin_token');
        }
      })
      .catch(() => {
        // If server verify fails or is offline, clear invalid session
        setAdminToken(null);
        setIsAdminAuthenticated(false);
      });
    }
  }, [adminToken]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('zt_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (storeLogo) {
      localStorage.setItem('zt_store_logo', storeLogo);
    } else {
      localStorage.removeItem('zt_store_logo');
    }
  }, [storeLogo]);

  useEffect(() => {
    localStorage.setItem('zt_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zt_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('zt_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('zt_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Admin Auth Actions
  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        setAdminUser(data.email);
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('zt_admin_token', data.token);
        sessionStorage.setItem('zt_admin_user', data.email);
        setIsAdminLoginOpen(false);
        setIsAdminOpen(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (err: any) {
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  };

  const logoutAdmin = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          }
        });
      } catch {
        // ignore error on logout
      }
    }

    setAdminToken(null);
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    sessionStorage.removeItem('zt_admin_token');
    sessionStorage.removeItem('zt_admin_user');
    localStorage.removeItem('zt_admin_token');
    showToast('Admin session ended. You are logged out.');
  };

  // Open Admin Portal gatekeeper
  const openAdminPortal = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Product CRUD with Server Auth Enforcement
  const addProduct = async (
    newProductData: Omit<Product, 'id' | 'slug' | 'discountPercent'> & { id?: string; discountPercent?: number }
  ): Promise<Product> => {
    if (!isAdminAuthenticated || !adminToken) {
      setIsAdminLoginOpen(true);
      throw new Error('Admin authentication required');
    }

    const id = newProductData.id || `zt-${Date.now().toString().slice(-6)}`;
    const slug = newProductData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const productToAdd: Product = {
      ...newProductData,
      id,
      slug: slug || id,
      discountPercent: newProductData.originalPrice > newProductData.price
        ? Math.round(((newProductData.originalPrice - newProductData.price) / newProductData.originalPrice) * 100)
        : 0
    };

    // Send to protected server endpoint
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(productToAdd)
    });

    if (res.status === 401) {
      await logoutAdmin();
      setIsAdminLoginOpen(true);
      throw new Error('Unauthorized: Admin session expired or invalid.');
    }

    if (!res.ok) {
      showToast('Error saving product on server.');
      throw new Error('Server rejected product creation.');
    }

    setProducts((prev) => [productToAdd, ...prev]);
    showToast(`Product "${productToAdd.title}" added to store!`);
    return productToAdd;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    if (!isAdminAuthenticated || !adminToken) {
      setIsAdminLoginOpen(true);
      throw new Error('Admin authentication required');
    }

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(updatedFields)
    });

    if (res.status === 401) {
      await logoutAdmin();
      setIsAdminLoginOpen(true);
      throw new Error('Unauthorized: Admin session expired or invalid.');
    }

    if (!res.ok) {
      showToast('Error updating product on server.');
      throw new Error('Server rejected product update.');
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updatedFields };
          if (updated.originalPrice && updated.price && updated.originalPrice > updated.price) {
            updated.discountPercent = Math.round(((updated.originalPrice - updated.price) / updated.originalPrice) * 100);
          }
          return updated;
        }
        return p;
      })
    );
    showToast('Product updated successfully!');
  };

  const deleteProduct = async (id: string) => {
    if (!isAdminAuthenticated || !adminToken) {
      setIsAdminLoginOpen(true);
      throw new Error('Admin authentication required');
    }

    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (res.status === 401) {
      await logoutAdmin();
      setIsAdminLoginOpen(true);
      throw new Error('Unauthorized: Admin session expired or invalid.');
    }

    if (!res.ok) {
      showToast('Error deleting product on server.');
      throw new Error('Server rejected product deletion.');
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((item) => item !== id));
    showToast('Product removed from store catalog.');
  };

  const resetProducts = () => {
    if (!isAdminAuthenticated) {
      setIsAdminLoginOpen(true);
      return;
    }
    setProducts(PRODUCTS);
    localStorage.setItem('zt_products', JSON.stringify(PRODUCTS));
    showToast('Catalog restored to default products.');
  };

  // Store Logo
  const updateStoreLogo = async (logoUri: string) => {
    if (!isAdminAuthenticated || !adminToken) {
      setIsAdminLoginOpen(true);
      throw new Error('Admin authentication required');
    }

    const res = await fetch('/api/admin/logo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ logo: logoUri })
    });

    if (res.status === 401) {
      await logoutAdmin();
      setIsAdminLoginOpen(true);
      throw new Error('Unauthorized: Admin session expired or invalid.');
    }

    if (!res.ok) {
      showToast('Error updating store logo on server.');
      throw new Error('Server rejected logo update.');
    }

    setStoreLogo(logoUri);
    showToast('Official store logo updated successfully!');
  };

  const removeStoreLogo = async () => {
    if (!isAdminAuthenticated || !adminToken) {
      setIsAdminLoginOpen(true);
      throw new Error('Admin authentication required');
    }

    const res = await fetch('/api/admin/logo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ logo: null })
    });

    if (res.status === 401) {
      await logoutAdmin();
      setIsAdminLoginOpen(true);
      throw new Error('Unauthorized: Admin session expired or invalid.');
    }

    if (!res.ok) {
      showToast('Error removing store logo on server.');
      throw new Error('Server rejected logo reset.');
    }

    setStoreLogo(null);
    showToast('Store logo reset to default.');
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    const color = selectedColor || (product.colors && product.colors[0]) || 'Default';
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
    showToast(`Added ${product.title.slice(0, 24)}... to bag`);
  };

  const removeFromCart = (productId: string, selectedColor?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (!selectedColor || item.selectedColor === selectedColor))
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (!selectedColor || item.selectedColor === selectedColor)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ZEE10' || clean === 'ZEETRENDS10') {
      setCouponCode(clean);
      setDiscountPercent(10);
      showToast('🎉 Coupon applied! 10% discount added.');
      return true;
    } else if (clean === 'WELCOME' || clean === 'ZEE5') {
      setCouponCode(clean);
      setDiscountPercent(5);
      showToast('🎉 Coupon applied! 5% discount added.');
      return true;
    } else {
      showToast('❌ Invalid coupon code. Try ZEE10');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = (
    orderData: Omit<PlacedOrder, 'orderId' | 'status' | 'trackingNumber' | 'orderDate'>
  ): PlacedOrder => {
    const orderId = `ZT-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `TRAX-PK${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date();
    const orderDate = `${now.toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: PlacedOrder = {
      ...orderData,
      orderId,
      status: 'Booked',
      trackingNumber,
      orderDate
    };

    // Publicly record order on server
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch((e) => console.warn('[Server Order Sync]', e));

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: PlacedOrder['status']) => {
    if (!isAdminAuthenticated || !adminToken) {
      setIsAdminLoginOpen(true);
      throw new Error('Admin authentication required');
    }

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status })
    });

    if (res.status === 401) {
      await logoutAdmin();
      setIsAdminLoginOpen(true);
      throw new Error('Unauthorized: Admin session expired or invalid.');
    }

    if (!res.ok) {
      showToast('Error updating order on server.');
      throw new Error('Server rejected order update.');
    }

    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
    showToast(`Order #${orderId} status updated to ${status}`);
  };

  const deleteOrder = async (orderId: string) => {
    if (!isAdminAuthenticated || !adminToken) {
      setIsAdminLoginOpen(true);
      throw new Error('Admin authentication required');
    }

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (res.status === 401) {
      await logoutAdmin();
      setIsAdminLoginOpen(true);
      throw new Error('Unauthorized: Admin session expired or invalid.');
    }

    if (!res.ok) {
      showToast('Error deleting order on server.');
      throw new Error('Server rejected order deletion.');
    }

    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    showToast(`Order #${orderId} deleted.`);
  };

  const addReview = (newReview: Omit<Review, 'id' | 'date' | 'verified'>) => {
    const item: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      verified: true
    };
    setReviews((prev) => [item, ...prev]);
    showToast('Thank you! Your verified review has been submitted.');
  };

  return (
    <StoreContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        adminToken,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        openAdminPortal,
        loginAdmin,
        logoutAdmin,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        storeLogo,
        updateStoreLogo,
        removeStoreLogo,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shippingFee,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        total,
        freeShippingProgress,
        freeShippingRemaining,
        wishlist,
        toggleWishlist,
        isWishlisted,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAdminOpen,
        setIsAdminOpen,
        activePolicyModal,
        setActivePolicyModal,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        reviews,
        addReview,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
