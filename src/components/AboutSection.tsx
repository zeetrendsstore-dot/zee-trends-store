import React from 'react';
import { ShieldCheck, Sparkles, Heart, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutSection: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <div className="bg-[#fafaf9] py-16 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner for About */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#b2883b] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Zee Trends Philosophy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
            Curating Modern Elegance for Pakistani Homes
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Founded with a passion for quality and authentic value, <strong>ZEE TRENDS STORE</strong> is a premier Pakistani online destination offering trending accessories, luxury watches, genuine leather wallets, clean beauty & skincare, and smart everyday home essentials.
          </p>
        </div>

        {/* 2-Column Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xl bg-white p-2">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100">
                <img
                  src="/src/assets/images/hero_luxury_lifestyle_1791123075996.jpg"
                  alt="Zee Trends Store Craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="font-serif text-xl font-bold">100% Quality Inspected</p>
                    <p className="text-xs text-stone-300">Each item is manually unboxed & tested before shipment.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold Seal Badge */}
            <div className="absolute -bottom-6 -right-4 bg-white border border-[#d4af37] rounded-xl p-4 shadow-xl hidden sm:flex items-center gap-3">
              <Award className="w-8 h-8 text-[#b2883b]" />
              <div>
                <p className="font-bold text-xs text-stone-900">Guaranteed Trust</p>
                <p className="text-[11px] text-stone-500">7-Day Easy Exchange Nationwide</p>
              </div>
            </div>
          </div>

          {/* Text Story */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Why We Started Zee Trends Store
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Pakistani e-commerce shoppers frequently face a frustrating dilemma: either overpriced imported luxury goods or low-quality local replicas that break in days.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              We founded <strong>ZEE TRENDS STORE</strong> to bridge that gap. We rigorously curate and test every single item in our inventory—from the precise movement of our chronographs to the pure organic ingredients in our skincare elixirs. If a product doesn't meet our exacting benchmark of elegance and durability, we simply do not sell it.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>No Fake Replicas:</strong> Only authentic, functional, and durable goods.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Transparent COD:</strong> Pay only when the courier hands the package to you.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Human WhatsApp Support:</strong> Direct Pakistani helpline via +92 324 0548272.</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setActiveTab('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#18181b] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#b2883b] transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                <span>Browse Our Curated Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
