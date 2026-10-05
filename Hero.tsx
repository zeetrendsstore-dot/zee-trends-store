import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const { setActiveTab, setSelectedCategory } = useStore();

  const handleShopNow = () => {
    setSelectedCategory('all');
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-[#fafaf9] border-b border-stone-200 overflow-hidden">
      {/* Subtle decorative radial gold glow */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 bg-[#f7f1dc]/40 rounded-full blur-3xl pointer-events-none -z-0" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 z-10 text-left">
            
            {/* Kicker (Clean unboxed metadata) */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#b2883b]">
              <span>Official Pakistani Store</span>
              <span aria-hidden="true">·</span>
              <span>100% Verified Quality</span>
              <span aria-hidden="true">·</span>
              <span>Cash on Delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.1] text-balance">
              Discover <span className="gold-gradient-text italic font-normal">What’s Trending</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              Shop stylish, useful and quality products selected for your everyday life. 
              From precision watches and handcrafted leather wallets to breakthrough skincare and everyday home solutions.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleShopNow}
                className="px-7 py-3.5 bg-[#18181b] text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#c5a059] hover:text-[#18181b] transition-all duration-200 shadow-md flex items-center gap-2 group cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 bg-white text-stone-900 border border-stone-300 text-xs font-bold uppercase tracking-widest rounded-md hover:border-[#b2883b] hover:text-[#b2883b] transition-all duration-200 shadow-xs cursor-pointer"
              >
                EXPLORE PRODUCTS
              </button>
            </div>

            {/* Micro proof line (Adjacency to claim) */}
            <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-[#b2883b]" />
                <span>Nationwide Express Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <RefreshCw className="w-4 h-4 text-[#b2883b]" />
                <span>7-Day Easy Exchange</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#b2883b]" />
                <span>Inspect Before Payment (COD)</span>
              </div>
            </div>

          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer frame with luxury gold border sheen */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-xl bg-white p-2">
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src="/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg"
                    alt="Zee Trends Store - Curated trending watches, leather wallets, and skincare"
                    className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback container styling if image fails
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Gradient bottom overlay for contrast & caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent flex items-end p-5">
                    <div className="text-white">
                      <div className="flex items-center gap-1 text-amber-400 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        <span className="text-xs text-white/90 font-medium ml-1">4.9 / 5.0 Star Rating</span>
                      </div>
                      <p className="text-sm font-medium tracking-wide text-stone-200">
                        "Curated excellence delivered directly to your doorstep in Karachi, Lahore, Islamabad & 120+ Pakistani cities."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Gold Quality Guarantee Badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-4 bg-white border border-[#d4af37]/50 rounded-xl p-3.5 shadow-lg items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="w-10 h-10 rounded-lg bg-[#fcf9f0] border border-[#d4af37] flex items-center justify-center text-[#b2883b]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">Cash on Delivery</p>
                  <p className="text-[11px] text-stone-500">Inspect parcel upon arrival</p>
                </div>
              </div>

              {/* Floating Shipping Counter Badge */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-[#18181b] text-white border border-stone-700 rounded-xl py-2 px-3.5 shadow-lg items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-stone-200">2-4 Days Fast Dispatch</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
