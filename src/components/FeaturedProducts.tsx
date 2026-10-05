import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

interface FeaturedProductsProps {
  onOpenQuickView: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onOpenQuickView }) => {
  const { products, setActiveTab, setSelectedCategory } = useStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'watches-wallets' | 'beauty-hair' | 'everyday-kitchen'>('all');

  const filteredProducts = products.filter((product) => {
    if (activeFilter === 'all') return product.isTrending || product.isBestSeller;
    if (activeFilter === 'watches-wallets') return product.category === 'watches' || product.category === 'wallets';
    if (activeFilter === 'beauty-hair') return product.category === 'beauty-skincare' || product.category === 'hair-care';
    if (activeFilter === 'everyday-kitchen') return product.category === 'kitchen' || product.category === 'trending' || product.category === 'kids';
    return true;
  });

  const handleViewAll = () => {
    setSelectedCategory('all');
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="trending-section" className="py-16 bg-[#fafaf9] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#b2883b] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked & Verified</span>
              <span aria-hidden="true">·</span>
              <span>Trending in Pakistan</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Most Popular Products
            </h2>
          </div>

          {/* Interactive filter tabs (allowed as functional button controls per frontend design constitution) */}
          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-1.5 p-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Trending
            </button>
            <button
              onClick={() => setActiveFilter('watches-wallets')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFilter === 'watches-wallets'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Watches & Wallets
            </button>
            <button
              onClick={() => setActiveFilter('beauty-hair')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFilter === 'beauty-hair'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Beauty & Care
            </button>
            <button
              onClick={() => setActiveFilter('everyday-kitchen')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFilter === 'everyday-kitchen'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Everyday & Home
            </button>
          </div>
        </div>

        {/* Product Cards Grid (3 columns desktop, 2 tablet/mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuickView={onOpenQuickView}
            />
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-12 text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-stone-300 text-stone-900 text-xs font-bold uppercase tracking-widest rounded-md hover:border-[#b2883b] hover:text-[#b2883b] transition-all shadow-xs cursor-pointer"
          >
            <span>VIEW COMPLETE CATALOG ({products.length} PRODUCTS)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
