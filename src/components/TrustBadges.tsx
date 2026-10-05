import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones, CheckCircle2 } from 'lucide-react';
import { STORE_PHONE } from '../utils/formatters';

export const TrustBadges: React.FC = () => {
  return (
    <section className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Claim Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#b2883b] mb-1">
            The Zee Trends Standard
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Why Thousands of Pakistani Shoppers Rely on Us
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            We bridge modern lifestyle trends with ironclad local reliability, prompt communication, and safe doorstep delivery.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-[#fafaf9] border border-stone-200 flex flex-col justify-between hover:border-[#d4af37] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#fcf9f0] border border-[#d4af37]/40 flex items-center justify-center text-[#b2883b] mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                Nationwide Cash on Delivery
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pay in cash right when the rider delivers your parcel. Available in Karachi, Lahore, Islamabad, and 120+ cities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free Delivery over Rs. 3,500</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-[#fafaf9] border border-stone-200 flex flex-col justify-between hover:border-[#d4af37] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#fcf9f0] border border-[#d4af37]/40 flex items-center justify-center text-[#b2883b] mb-4">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                7-Day Easy Exchange
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hassle-free replacement policy if you receive a damaged piece, sizing mismatch, or functional defect.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doorstep Pickup Available</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-[#fafaf9] border border-stone-200 flex flex-col justify-between hover:border-[#d4af37] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#fcf9f0] border border-[#d4af37]/40 flex items-center justify-center text-[#b2883b] mb-4">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                Direct WhatsApp Support
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Got a question before ordering? Chat directly with our friendly Pakistani customer team at {STORE_PHONE}.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Response within 15 Minutes</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-xl bg-[#fafaf9] border border-stone-200 flex flex-col justify-between hover:border-[#d4af37] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#fcf9f0] border border-[#d4af37]/40 flex items-center justify-center text-[#b2883b] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                Triple Inspected Quality
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every watch, serum bottle, and electronic gadget undergoes manual physical testing before bubble wrapping.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>No Broken Dispatches</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
