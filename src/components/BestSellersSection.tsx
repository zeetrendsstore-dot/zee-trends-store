import React from 'react';
import { Star, ArrowRight, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../data/products';

interface BestSellersSectionProps {
  onOpenQuickView: (product: Product) => void;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ onOpenQuickView }) => {
  const { products, setActiveTab, setSelectedCategory } = useStore();

  const bestSellerProducts = products.filter((p) => p.isBestSeller);
  // Fallback to top rating if none explicitly marked
  const displayProducts = bestSellerProducts.length > 0
    ? bestSellerProducts
    : products.slice(0, 4);

  return (
    <section className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#b2883b] mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
              <span aria-hidden="true">·</span>
              <span>Highest Re-Order Rate</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Best Sellers Collection
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-3 md:mt-0 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#b2883b] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuickView={onOpenQuickView}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
