import React from 'react';
import { ArrowRight, Sparkles, Tag, Truck, ShieldCheck, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_PHONE, generateWhatsAppUrl } from '../utils/formatters';

export const PromoSection: React.FC = () => {
  const { setActiveTab, setSelectedCategory } = useStore();

  return (
    <section className="py-16 bg-[#fafaf9] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Promotional Campaign Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#121212] via-[#1c1917] to-[#18181b] text-white p-8 sm:p-12 border border-[#d4af37]/30 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Online Promotion</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Elevate Your Everyday Essentials
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Order our precision chronograph watches paired with genuine full-grain leather wallets and get <strong>Free Express Delivery across Pakistan</strong> + 10% off using coupon code <strong className="text-[#d4af37]">ZEE10</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('watches');
                  setActiveTab('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#d4af37] text-stone-950 text-xs font-bold uppercase tracking-wider rounded hover:bg-[#e6ca65] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Shop Watches & Wallets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={generateWhatsAppUrl('Salam Zee Trends! I want to inquire about the promotional discount bundle.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-colors cursor-pointer"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>

          {/* Decorative Background Accent */}
          <div 
            className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" 
            aria-hidden="true" 
          />
        </div>

        {/* Social Media Community Section */}
        <div className="pt-4">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="text-xs font-semibold tracking-widest uppercase text-[#b2883b] mb-1">
              Join Our Pakistani Community
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Follow @zeet.rendsstore
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Watch product demonstrations, unboxing clips, customer styling reels and flash drops.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Instagram */}
            <a
              href="https://instagram.com/zeet.rendsstore"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#d4af37] shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-stone-900">Instagram</span>
              <span className="text-[10px] text-stone-400">@zeet.rendsstore</span>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#d4af37] shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-stone-900">Facebook</span>
              <span className="text-[10px] text-stone-400">ZEE TRENDS</span>
            </a>

            {/* Pinterest */}
            <a
              href="https://pinterest.com/zeetrendsstore"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#d4af37] shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-base group-hover:scale-110 transition-transform">
                P
              </div>
              <span className="font-bold text-xs text-stone-900">Pinterest</span>
              <span className="text-[10px] text-stone-400">@zeetrendsstore</span>
            </a>

            {/* Threads */}
            <a
              href="https://threads.net/@zeetrendsstore"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#d4af37] shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center font-bold text-base group-hover:scale-110 transition-transform">
                @
              </div>
              <span className="font-bold text-xs text-stone-900">Threads</span>
              <span className="text-[10px] text-stone-400">@zeetrendsstore</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#d4af37] shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Linkedin className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-stone-900">LinkedIn</span>
              <span className="text-[10px] text-stone-400">Zee Trends</span>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white border border-stone-200 hover:border-[#d4af37] shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Youtube className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-stone-900">YouTube</span>
              <span className="text-[10px] text-stone-400">Zee Trends Store</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
