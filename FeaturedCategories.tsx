import React from 'react';
import { 
  Sparkles, 
  Watch, 
  CreditCard, 
  Glasses, 
  HeartHandshake, 
  UtensilsCrossed, 
  Smile, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useStore } from '../context/StoreContext';

export const FeaturedCategories: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useStore();

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#b2883b]" />;
      case 'Watch': return <Watch className="w-5 h-5 text-[#b2883b]" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-[#b2883b]" />;
      case 'Glasses': return <Glasses className="w-5 h-5 text-[#b2883b]" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-[#b2883b]" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-[#b2883b]" />;
      case 'Smile': return <Smile className="w-5 h-5 text-[#b2883b]" />;
      default: return <Flame className="w-5 h-5 text-[#b2883b]" />;
    }
  };

  return (
    <section className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#b2883b] mb-1">
              <span>Curated Departments</span>
              <span aria-hidden="true">·</span>
              <span>8 Collections</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Featured Categories
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-3 md:mt-0 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#b2883b] flex items-center gap-1.5 transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>Explore All Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.slug)}
              className="group relative bg-[#fafaf9] rounded-xl border border-stone-200 overflow-hidden cursor-pointer hover:border-[#d4af37] transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col"
            >
              {/* Image Preview with Aspect Ratio */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* Visual subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Badge (Subtle unboxed text tag) */}
                {category.badge && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] uppercase font-bold tracking-wider text-stone-900 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                    {category.badge}
                  </span>
                )}

                {/* Floating Category Icon */}
                <div className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs">
                  {getCategoryIcon(category.iconName)}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#b2883b] transition-colors leading-snug">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 line-clamp-1">
                    {category.description}
                  </p>
                </div>
                
                <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-400 group-hover:text-[#b2883b] transition-colors">
                  <span className="font-medium text-[11px]">{category.itemCount} items available</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
