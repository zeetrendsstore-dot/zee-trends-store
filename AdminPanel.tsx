import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Package, 
  DollarSign, 
  Check, 
  Upload, 
  RotateCcw, 
  TrendingUp, 
  Star, 
  Image as ImageIcon,
  Truck,
  Phone,
  Eye,
  Sliders,
  AlertTriangle,
  LogOut,
  Shield
} from 'lucide-react';
import { useStore, PlacedOrder } from '../context/StoreContext';
import { Product, CATEGORIES } from '../data/products';
import { formatPKR, generateWhatsAppUrl } from '../utils/formatters';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { 
    isAdminAuthenticated,
    adminUser,
    logoutAdmin,
    setIsAdminLoginOpen,
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetProducts,
    storeLogo,
    updateStoreLogo,
    removeStoreLogo,
    orders,
    updateOrderStatus,
    deleteOrder,
    showToast
  } = useStore();

  // Route / View Guard: redirect unauthenticated access attempts to Admin Login screen
  useEffect(() => {
    if (isOpen && !isAdminAuthenticated) {
      onClose();
      setIsAdminLoginOpen(true);
    }
  }, [isOpen, isAdminAuthenticated]);

  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'logo' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form State for Add / Edit
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [price, setPrice] = useState<number>(2500);
  const [originalPrice, setOriginalPrice] = useState<number>(3500);
  const [stockCount, setStockCount] = useState<number>(20);
  const [inStock, setInStock] = useState(true);
  const [isTrending, setIsTrending] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<number>(4.8);
  const [reviewCount, setReviewCount] = useState<number>(15);
  const [sku, setSku] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [variants, setVariants] = useState<string>('Standard');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate dashboard stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stockCount || 0), 0);
  const outOfStockCount = products.filter((p) => !p.inStock || p.stockCount <= 0).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setCategory(product.category);
    setPrice(product.price);
    setOriginalPrice(product.originalPrice || product.price);
    setStockCount(product.stockCount || 10);
    setInStock(product.inStock);
    setIsTrending(!!product.isTrending);
    setIsBestSeller(!!product.isBestSeller);
    setIsNew(!!product.isNew);
    setShortDesc(product.shortDesc);
    setDescription(product.description);
    setRating(product.rating || 4.8);
    setReviewCount(product.reviewCount || 10);
    setSku(product.sku);
    setImageUrls(product.images.length > 0 ? product.images : ['']);
    setVariants(product.colors ? product.colors.join(', ') : '');
    setActiveTab('add');
  };

  const handleResetForm = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory(CATEGORIES[0].slug);
    setPrice(2500);
    setOriginalPrice(3500);
    setStockCount(20);
    setInStock(true);
    setIsTrending(false);
    setIsBestSeller(false);
    setIsNew(false);
    setShortDesc('');
    setDescription('');
    setRating(4.8);
    setReviewCount(15);
    setSku(`ZT-PRD-${Math.floor(1000 + Math.random() * 9000)}`);
    setImageUrls(['']);
    setVariants('Standard');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setImageUrls((prev) => {
          const filtered = prev.filter((u) => u.trim() !== '');
          return [base64, ...filtered];
        });
        showToast('Image uploaded and preview ready!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateStoreLogo(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Product title is required!');
      return;
    }

    const cleanImages = imageUrls.filter((url) => url.trim() !== '');
    if (cleanImages.length === 0) {
      // Default placeholder if none
      cleanImages.push('/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg');
    }

    const variantList = variants
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const productPayload = {
      title: title.trim(),
      category,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      stockCount: Number(stockCount),
      inStock,
      isTrending,
      isBestSeller,
      isNew,
      shortDesc: shortDesc.trim() || title.trim(),
      description: description.trim() || shortDesc.trim() || title.trim(),
      rating: Number(rating),
      reviewCount: Number(reviewCount),
      sku: sku.trim() || `ZT-ITEM-${Date.now().toString().slice(-4)}`,
      images: cleanImages,
      colors: variantList.length > 0 ? variantList : undefined,
      features: [
        '100% Inspected & Verified Quality',
        'Nationwide Cash on Delivery Available',
        '7-Day Easy Exchange Policy',
        'Official Zee Trends Store Guarantee'
      ],
      specs: {
        'Category': category.replace('-', ' ').toUpperCase(),
        'SKU': sku.trim() || 'ZT-NEW',
        'Condition': 'Brand New / Sealed',
        'Warranty': '7 Days Doorstep Replacement'
      },
      tags: [category, 'Zee Trends', 'Pakistan']
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    handleResetForm();
    setActiveTab('products');
  };

  if (!isOpen || !isAdminAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header */}
        <div className="px-6 py-4 bg-[#18181b] text-white border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#d4af37] text-stone-950 font-serif font-bold flex items-center justify-center text-sm">
              ZT
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span>ZEE TRENDS STORE — Store Management</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                  Live Admin
                </span>
              </h2>
              <p className="text-xs text-stone-400 flex items-center gap-2">
                <span>Authenticated as: <strong className="text-stone-200">{adminUser || 'zeetrendsstore@gmail.com'}</strong></span>
                <span className="text-stone-600">·</span>
                <span>Server-protected API</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/80 border border-red-800 text-red-300 rounded text-xs font-semibold hover:bg-red-900 transition-colors"
              title="Sign out of admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-[#fafaf9] border-b border-stone-200 px-6 py-3 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs shrink-0">
          <div className="p-2 rounded bg-white border border-stone-200">
            <span className="text-stone-500 block">Total Catalog</span>
            <span className="font-bold text-stone-900 text-sm">{totalProducts} Products</span>
          </div>
          <div className="p-2 rounded bg-white border border-stone-200">
            <span className="text-stone-500 block">Inventory Stock</span>
            <span className="font-bold text-stone-900 text-sm">{totalStock} Units</span>
          </div>
          <div className="p-2 rounded bg-white border border-stone-200">
            <span className="text-stone-500 block">Out of Stock</span>
            <span className={`font-bold text-sm ${outOfStockCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {outOfStockCount} Items
            </span>
          </div>
          <div className="p-2 rounded bg-white border border-stone-200">
            <span className="text-stone-500 block">Customer Orders</span>
            <span className="font-bold text-stone-900 text-sm">{totalOrders} Placed</span>
          </div>
          <div className="p-2 rounded bg-white border border-stone-200 col-span-2 sm:col-span-1">
            <span className="text-stone-500 block">Total Revenue</span>
            <span className="font-bold text-stone-900 text-sm tabular-nums">{formatPKR(totalRevenue)}</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 border-b border-stone-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex gap-2 sm:gap-6 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-2 pt-1 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-b-2 border-[#b2883b] text-[#b2883b]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Products ({products.length})
            </button>

            <button
              onClick={() => {
                handleResetForm();
                setActiveTab('add');
              }}
              className={`pb-2 pt-1 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'add'
                  ? 'border-b-2 border-[#b2883b] text-[#b2883b]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingProduct ? 'Edit Product' : 'Add New Product'}</span>
            </button>

            <button
              onClick={() => setActiveTab('logo')}
              className={`pb-2 pt-1 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'logo'
                  ? 'border-b-2 border-[#b2883b] text-[#b2883b]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Store Logo & Branding</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-2 pt-1 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-b-2 border-[#b2883b] text-[#b2883b]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset catalog back to initial default products? Any custom products will be overwritten.')) {
                resetProducts();
              }
            }}
            className="hidden md:flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-800 transition-colors"
            title="Reset catalog to sample defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Products</span>
          </button>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === 'products' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search products by title or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-[#b2883b]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-stone-300 rounded bg-white text-stone-800 focus:outline-none focus:border-[#b2883b]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('add');
                  }}
                  className="px-4 py-1.5 bg-[#18181b] text-white rounded text-xs font-semibold hover:bg-[#b2883b] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-[#fafaf9] text-stone-500 font-semibold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Sale Price</th>
                      <th className="py-3 px-4">Regular Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-center">Featured</th>
                      <th className="py-3 px-4 text-center">Best Seller</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-stone-50/80 transition-colors">
                        {/* Item image + Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-stone-900 line-clamp-1 max-w-xs">
                                {product.title}
                              </p>
                              <span className="text-[10px] text-stone-400 font-mono">
                                SKU: {product.sku}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="capitalize font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                            {product.category.replace('-', ' ')}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-bold text-stone-900 tabular-nums">
                          {formatPKR(product.price)}
                        </td>

                        {/* Original Price */}
                        <td className="py-3 px-4 text-stone-400 tabular-nums line-through">
                          {formatPKR(product.originalPrice || product.price)}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                              product.inStock && product.stockCount > 0
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                          </span>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => updateProduct(product.id, { isTrending: !product.isTrending })}
                            className={`p-1 rounded text-xs transition-colors ${
                              product.isTrending
                                ? 'text-[#b2883b] bg-[#fcf9f0]'
                                : 'text-stone-300 hover:text-stone-500'
                            }`}
                            title="Toggle Featured/Trending status"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                        </td>

                        {/* Best Seller Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => updateProduct(product.id, { isBestSeller: !product.isBestSeller })}
                            className={`p-1 rounded text-xs transition-colors ${
                              product.isBestSeller
                                ? 'text-amber-500 bg-amber-50'
                                : 'text-stone-300 hover:text-stone-500'
                            }`}
                            title="Toggle Best Seller status"
                          >
                            <Star className={`w-4 h-4 ${product.isBestSeller ? 'fill-current' : ''}`} />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="p-1.5 text-stone-600 hover:text-[#b2883b] hover:bg-stone-100 rounded transition-colors"
                              title="Edit product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${product.title}"?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Add / Edit Product Form */}
        {activeTab === 'add' && (
          <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Product to Store'}
                </h3>
                <p className="text-xs text-stone-500">
                  Changes will immediately reflect across Home, Category pages, Search, and Cart.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('products');
                  }}
                  className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#18181b] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#b2883b] transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Basic Details */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Sovereign Chronograph Gold Mesh Watch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#b2883b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Department / Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#b2883b]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Sale Price in PKR (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#b2883b] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Original Price (Strikethrough)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#b2883b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Short Description (1-2 sentences)
                  </label>
                  <input
                    type="text"
                    placeholder="Brief highlights shown on product card"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#b2883b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Full Description & Craftsmanship Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Detailed overview, specs, materials, instructions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#b2883b]"
                  />
                </div>

                {/* Variants */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Variants / Colors (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gold Mesh, Obsidian Black, Silver Steel"
                    value={variants}
                    onChange={(e) => setVariants(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#b2883b]"
                  />
                  <span className="text-[11px] text-stone-400">
                    Customers can choose between these variants in the Quick View and checkout modal.
                  </span>
                </div>
              </div>

              {/* Right Column: Inventory & Badges */}
              <div className="md:col-span-4 space-y-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h4 className="font-serif font-bold text-stone-900 text-sm">Inventory & Promotion</h4>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-stone-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white"
                  />
                </div>

                <div className="pt-2 border-t border-stone-200/80 space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="rounded text-[#b2883b] focus:ring-[#b2883b]"
                    />
                    <span>Available In Stock (Purchasable)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={(e) => setIsTrending(e.target.checked)}
                      className="rounded text-[#b2883b] focus:ring-[#b2883b]"
                    />
                    <span>Mark as Featured / Trending</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="rounded text-[#b2883b] focus:ring-[#b2883b]"
                    />
                    <span>Mark as Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="rounded text-[#b2883b] focus:ring-[#b2883b]"
                    />
                    <span>New Arrival Badge</span>
                  </label>
                </div>

                {/* Rating */}
                <div className="pt-2 border-t border-stone-200/80">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Rating (out of 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded bg-white"
                  />
                </div>
              </div>

            </div>

            {/* Images Manager */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm">Product Images & Gallery</h4>
                  <p className="text-[11px] text-stone-500">
                    Upload image file from your device, or paste image URL.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#b2883b] text-white rounded text-xs font-semibold hover:bg-[#8f6927] transition-colors flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrls([...imageUrls, ''])}
                    className="px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:border-stone-400"
                  >
                    + Add URL Field
                  </button>
                </div>
              </div>

              {/* URL input rows */}
              <div className="space-y-2">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Paste image URL (e.g. /src/assets/images/... or web URL or base64)"
                      value={url}
                      onChange={(e) => {
                        const next = [...imageUrls];
                        next[idx] = e.target.value;
                        setImageUrls(next);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded bg-white font-mono"
                    />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                        className="p-1.5 text-stone-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Previews */}
              <div className="flex gap-3 pt-2 overflow-x-auto">
                {imageUrls.filter((u) => u.trim() !== '').map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded border border-stone-300 overflow-hidden bg-white shrink-0">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-stone-900/80 text-white text-[9px] text-center font-bold">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  handleResetForm();
                  setActiveTab('products');
                }}
                className="px-6 py-2.5 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#18181b] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#b2883b] transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Add to Catalog'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Official Store Logo & Branding */}
        {activeTab === 'logo' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-3xl space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Official ZEE TRENDS STORE Logo Management
              </h3>
              <p className="text-xs text-stone-500">
                Upload your official logo file. Proportions and appearance are preserved exactly without distortion or recoloring.
              </p>
            </div>

            {/* Logo Preview Card */}
            <div className="p-6 rounded-xl border border-stone-200 bg-stone-50 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Active Website Logo Preview:
              </h4>

              <div className="p-6 bg-white rounded-lg border border-stone-200 flex items-center justify-center min-h-[120px]">
                {storeLogo ? (
                  <img
                    src={storeLogo}
                    alt="ZEE TRENDS STORE Official Logo"
                    className="max-h-16 w-auto object-contain"
                  />
                ) : (
                  <img
                    src="/zee-trends-logo.svg"
                    alt="ZEE TRENDS STORE Official Vector Logo"
                    className="max-h-14 w-auto object-contain"
                  />
                )}
              </div>

              {/* Dark mode background preview */}
              <div className="p-6 bg-[#121212] rounded-lg border border-stone-800 flex items-center justify-center min-h-[120px]">
                {storeLogo ? (
                  <img
                    src={storeLogo}
                    alt="ZEE TRENDS STORE Official Logo (Dark BG)"
                    className="max-h-16 w-auto object-contain"
                  />
                ) : (
                  <img
                    src="/zee-trends-logo-light.svg"
                    alt="ZEE TRENDS STORE Official Vector Logo"
                    className="max-h-14 w-auto object-contain"
                  />
                )}
              </div>
            </div>

            {/* Upload Controls */}
            <div className="p-6 rounded-xl border border-stone-200 bg-white space-y-4">
              <h4 className="font-bold text-sm text-stone-900">Upload New Official Logo</h4>
              <p className="text-xs text-stone-600">
                Select your logo file (PNG with transparency, SVG, or JPG). It will automatically be stored and applied to the header, mobile drawer, footer, and checkout.
              </p>

              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFileUpload}
                className="hidden"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="px-6 py-2.5 bg-[#b2883b] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#8f6927] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo from Computer / Device</span>
                </button>

                {storeLogo && (
                  <button
                    type="button"
                    onClick={removeStoreLogo}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 rounded text-xs font-semibold hover:bg-stone-50"
                  >
                    Reset to Default Official Vector Logo
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Customer Orders */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Customer Orders Received ({orders.length})
                </h3>
                <p className="text-xs text-stone-500">
                  View orders, update courier shipping statuses, or contact customers directly via WhatsApp.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-stone-50 rounded-xl border border-stone-200">
                <Truck className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                <p className="font-bold text-stone-800 text-sm">No Orders Yet</p>
                <p className="text-xs text-stone-500">
                  When customers place orders via Cash on Delivery or Bank Transfer, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-base font-serif">
                            Order #{order.orderId}
                          </span>
                          <span className="text-xs font-mono text-stone-400">
                            Tracking: {order.trackingNumber}
                          </span>
                        </div>
                        <span className="text-xs text-stone-400">{order.orderDate}</span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-medium">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.orderId, e.target.value as PlacedOrder['status'])
                          }
                          className="px-2.5 py-1 text-xs font-bold rounded border border-stone-300 bg-stone-50 focus:outline-none focus:border-[#b2883b]"
                        >
                          <option value="Booked">Booked</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="In-Transit">In-Transit</option>
                          <option value="Delivered">Delivered (Paid)</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700 bg-stone-50 p-3 rounded-lg">
                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">CUSTOMER:</span>
                        <p className="font-bold text-stone-900">{order.customerName}</p>
                        <p className="text-stone-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#25D366]" />
                          <span>{order.phone}</span>
                        </p>
                        {order.email && <p className="text-stone-500">{order.email}</p>}
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">DELIVERY DESTINATION:</span>
                        <p className="font-medium text-stone-900">{order.city}{order.province ? `, ${order.province}` : ''}</p>
                        <p className="text-stone-600 text-[11px] leading-tight mt-0.5">{order.address}</p>
                        {order.notes && <p className="text-amber-800 text-[11px] italic mt-1">Note: {order.notes}</p>}
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">PAYMENT & TOTAL:</span>
                        <p className="font-bold text-stone-900 text-sm tabular-nums">
                          {formatPKR(order.total)}
                        </p>
                        <span className="text-[11px] font-semibold uppercase text-[#b2883b]">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer'}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-1.5 pt-1 text-xs">
                      <span className="font-bold text-stone-700 text-[11px] uppercase tracking-wider">
                        Ordered Items ({order.items.length}):
                      </span>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-stone-700">
                          <span>
                            {item.product.title} (x{item.quantity}{item.selectedColor ? ` · ${item.selectedColor}` : ''})
                          </span>
                          <span className="font-bold tabular-nums">
                            {formatPKR(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Action Buttons */}
                    <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                      <a
                        href={generateWhatsAppUrl(
                          `Salam ${order.customerName}! This is Zee Trends Store regarding your Order #${order.orderId}. Status: ${order.status}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#25D366] text-white rounded text-xs font-semibold hover:bg-[#1ebc59] flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat Customer on WhatsApp</span>
                      </a>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete order #${order.orderId}?`)) {
                            deleteOrder(order.orderId);
                          }
                        }}
                        className="px-3 py-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded text-xs transition-colors"
                      >
                        Delete Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
