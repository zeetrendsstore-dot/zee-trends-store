import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { CATEGORIES, Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/formatters';

interface AllProductsViewProps {
  onOpenQuickView: (product: Product) => void;
}

export const AllProductsView: React.FC<AllProductsViewProps> = ({ onOpenQuickView }) => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();
  
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchTag = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTag) return false;
      }
      // In stock
      if (inStockOnly && !product.inStock) {
        return false;
      }
      // Price
      if (product.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, maxPrice, sortBy]);

  const activeCategoryObject = CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div className="bg-[#fafaf9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header Banner */}
        <div className="mb-8 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span>Home</span>
            <span aria-hidden="true">/</span>
            <span>Catalog</span>
            {activeCategoryObject && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#b2883b] font-medium">{activeCategoryObject.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                {activeCategoryObject ? activeCategoryObject.name : 'All Products'}
              </h1>
              <p className="mt-1 text-xs text-stone-500">
                Showing {filteredProducts.length} items with Cash on Delivery across Pakistan
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden self-start flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-md text-xs font-semibold text-stone-800"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#b2883b]" />
              <span>Filters & Sorting</span>
            </button>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-serif font-bold text-stone-900 text-base">Filter Catalog</span>
              {(selectedCategory !== 'all' || searchQuery || inStockOnly || maxPrice < 6000) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setInStockOnly(false);
                    setMaxPrice(6000);
                  }}
                  className="text-xs text-[#b2883b] hover:underline font-medium"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Categories Filter List */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Departments
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left py-1.5 px-2.5 rounded text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#18181b] text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-[10px] opacity-75">{products.length}</span>
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left py-1.5 px-2.5 rounded text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-[#18181b] text-white'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-75">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Maximum Price
                </label>
                <span className="text-xs font-semibold text-[#b2883b] tabular-nums">
                  {formatPKR(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="6000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#b2883b] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Rs. 1,000</span>
                <span>Rs. 6,000</span>
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="pt-4 border-t border-stone-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#b2883b] focus:ring-[#b2883b]"
                />
                <span>In-Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            
            {/* Top Toolbar (Sort by + Search query tag if active) */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                {searchQuery && (
                  <span className="bg-stone-100 px-2 py-1 rounded flex items-center gap-1.5">
                    Query: <strong className="text-stone-900">{searchQuery}</strong>
                    <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                <span>Showing <strong>{filteredProducts.length}</strong> results</span>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-xs font-medium text-stone-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold bg-transparent border-0 text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured & Trending</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenQuickView={onOpenQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-stone-200 p-8">
                <Sparkles className="w-12 h-12 text-[#b2883b] mx-auto mb-3 opacity-60" />
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
                  No products found matching filters
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                  Try adjusting your price range or search terms, or explore other collections.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setMaxPrice(6000);
                  }}
                  className="px-6 py-2.5 bg-[#18181b] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#b2883b] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <h3 className="font-serif text-lg font-bold text-stone-900">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-stone-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Departments */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded text-xs ${
                      selectedCategory === 'all' ? 'bg-[#18181b] text-white' : 'text-stone-700'
                    }`}
                  >
                    All Products
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded text-xs ${
                        selectedCategory === cat.slug ? 'bg-[#18181b] text-white' : 'text-stone-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Max Price */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Max Price: {formatPKR(maxPrice)}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="6000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#b2883b]"
                />
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-[#18181b] text-white text-xs font-bold uppercase tracking-wider rounded-md"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
