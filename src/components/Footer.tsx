import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Instagram, 
  Facebook, 
  Linkedin,
  Youtube,
  CheckCircle2,
  Lock,
  Search,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { STORE_PHONE, STORE_EMAIL, generateWhatsAppUrl } from '../utils/formatters';
import { Logo } from './Logo';

interface FooterProps {
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTrackOrder }) => {
  const { 
    setActiveTab, 
    setSelectedCategory, 
    showToast,
    setIsSearchOpen,
    setIsCartOpen,
    isAdminAuthenticated,
    openAdminPortal,
    logoutAdmin,
    setActivePolicyModal
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleCategoryClick = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tab: 'home' | 'products' | 'about' | 'contact') => {
    setActiveTab(tab);
    if (tab === 'products') setSelectedCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    showToast('🎉 Shukriya for joining! Use code ZEE10 for 10% off.');
  };

  return (
    <footer className="bg-[#121212] text-stone-300 border-t border-stone-800">
      
      {/* Top Value Banner */}
      <div className="border-b border-stone-800/80 py-8 bg-[#18181b]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#27272a] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Free Delivery Nationwide</h4>
              <p className="text-[11px] text-stone-400">On all eligible orders over Rs. 3,500</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#27272a] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cash on Delivery (COD)</h4>
              <p className="text-[11px] text-stone-400">Doorstep payment available in 120+ cities</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#27272a] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 WhatsApp Support</h4>
              <p className="text-[11px] text-stone-400">{STORE_PHONE}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col with Official Logo */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-left">
              <Logo variant="light" size="md" />
            </div>

            <p className="text-xs text-stone-400 leading-relaxed pr-4">
              Pakistan's trusted destination for trending accessories, luxury chronographs, genuine leather wallets, clean beauty & skincare, and smart everyday useful innovations.
            </p>

            {/* Social handles list (All 6 platforms requested) */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <a
                href="https://instagram.com/zeet.rendsstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#d4af37] hover:text-[#18181b] flex items-center justify-center transition-colors"
                title="Instagram @zeet.rendsstore"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#d4af37] hover:text-[#18181b] flex items-center justify-center transition-colors"
                title="Facebook ZEE TRENDS STORE"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://pinterest.com/zeetrendsstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#d4af37] hover:text-[#18181b] flex items-center justify-center font-bold text-xs transition-colors"
                title="Pinterest @zeetrendsstore"
              >
                P
              </a>

              <a
                href="https://threads.net/@zeetrendsstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#d4af37] hover:text-[#18181b] flex items-center justify-center font-bold text-xs transition-colors"
                title="Threads @zeetrendsstore"
              >
                @
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#d4af37] hover:text-[#18181b] flex items-center justify-center transition-colors"
                title="LinkedIn Zee Trends"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#d4af37] hover:text-[#18181b] flex items-center justify-center transition-colors"
                title="YouTube Zee Trends Store"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {/* Direct Contact Details */}
            <div className="pt-3 text-xs space-y-1.5 text-stone-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                <a href={generateWhatsAppUrl('Salam!')} className="hover:text-white transition-colors">
                  {STORE_PHONE}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-white transition-colors">
                  {STORE_EMAIL}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links & Account */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Contact Us
                </button>
              </li>
              {isAdminAuthenticated && (
                <li>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openAdminPortal}
                      className="text-[#d4af37] font-semibold hover:underline flex items-center gap-1.5"
                    >
                      <Lock className="w-3 h-3 text-[#d4af37]" />
                      <span>Admin Dashboard (Active)</span>
                    </button>
                    <button
                      onClick={logoutAdmin}
                      className="text-[10px] text-stone-500 hover:text-red-400"
                    >
                      [Logout]
                    </button>
                  </div>
                </li>
              )}
              <li>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  My Cart
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Search Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('products')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrackOrder}
                  className="hover:text-[#d4af37] transition-colors text-[#d4af37]"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Policies Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePolicyModal('shipping')}
                  className="hover:text-[#d4af37] transition-colors text-left"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('return')}
                  className="hover:text-[#d4af37] transition-colors text-left"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('privacy')}
                  className="hover:text-[#d4af37] transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('terms')}
                  className="hover:text-[#d4af37] transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-[#d4af37] transition-colors text-left"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Promo */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              VIP Club & Discounts
            </h4>
            <p className="text-xs text-stone-400">
              Subscribe to get instant notification of new trending imports and 10% off your first order.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Coupon: <strong>ZEE10</strong> applied to your cart!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#222226] border border-stone-700 rounded text-white focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#d4af37] text-stone-950 font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e6ca65] transition-colors cursor-pointer"
                >
                  Join VIP Club
                </button>
              </form>
            )}

            <div className="pt-2">
              <span className="text-[11px] text-stone-500 block">Accepted in Pakistan:</span>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-xs text-stone-300 font-semibold">
                <span className="px-2 py-0.5 bg-[#27272a] rounded border border-stone-700 text-[10px]">
                  Cash on Delivery
                </span>
                <span className="px-2 py-0.5 bg-[#27272a] rounded border border-stone-700 text-[10px]">
                  Bank Transfer
                </span>
                <span className="px-2 py-0.5 bg-[#27272a] rounded border border-stone-700 text-[10px]">
                  Easypaisa / JazzCash
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} ZEE TRENDS STORE. All rights reserved. Registered Pakistani Online Store.</p>
          <p className="flex items-center gap-3">
            <span>Karachi</span>
            <span>•</span>
            <span>Lahore</span>
            <span>•</span>
            <span>Islamabad</span>
            <span>•</span>
            <span>Nationwide Delivery</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
