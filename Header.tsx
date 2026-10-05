import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Truck, 
  PackageCheck,
  Sparkles,
  Watch,
  CreditCard,
  Glasses,
  HeartHandshake,
  UtensilsCrossed,
  Smile,
  Zap,
  ArrowRight,
  Sliders,
  LogOut,
  Shield
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { STORE_PHONE } from '../utils/formatters';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenWishlist: () => void;
  onOpenTrackOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenWishlist, onOpenTrackOrder }) => {
  const { 
    cartCount, 
    setIsCartOpen, 
    setIsSearchOpen, 
    isAdminAuthenticated,
    setIsAdminOpen,
    logoutAdmin,
    activeTab, 
    setActiveTab, 
    setSelectedCategory, 
    wishlist,
    subtotal
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setActiveTab('products');
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tab: 'home' | 'products' | 'about' | 'contact') => {
    setActiveTab(tab);
    if (tab === 'products') setSelectedCategory('all');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#c5a059]" />;
      case 'Watch': return <Watch className="w-4 h-4 text-[#c5a059]" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4 text-[#c5a059]" />;
      case 'Glasses': return <Glasses className="w-4 h-4 text-[#c5a059]" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-[#c5a059]" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4 text-[#c5a059]" />;
      case 'Smile': return <Smile className="w-4 h-4 text-[#c5a059]" />;
      default: return <Zap className="w-4 h-4 text-[#c5a059]" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#121212] text-[#fcf9f0] border-b border-[#27272a] text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between text-[11px] sm:text-xs">
          <div className="hidden sm:flex items-center gap-2 text-stone-300">
            <Truck className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span className="truncate">Cash on Delivery Available Across Pakistan</span>
          </div>

          <div className="flex-1 text-center font-medium px-1 truncate">
            <span className="text-[#e6ca65] font-semibold">FREE DELIVERY AVAILABLE</span>
            <span className="mx-1.5 text-stone-500">•</span>
            <span className="text-stone-200">SHOP TRENDING PRODUCTS</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-stone-300">
            <a 
              href={`https://wa.me/923240548272`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
              <span>{STORE_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Bar (Conforms to 3-Zone Contract) */}
      <div className={`border-b border-stone-200 transition-all duration-200 ${isScrolled ? 'py-2.5 shadow-sm' : 'py-3 sm:py-4'}`}>
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Logo (Preserving original proportions and appearance) */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-stone-800 hover:text-[#c5a059] transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <button 
              onClick={() => handleNavClick('home')}
              className="group flex items-center text-left focus:outline-none min-w-0"
              title="ZEE TRENDS STORE — Home"
            >
              <Logo size="md" />
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-[#b2883b] ${activeTab === 'home' ? 'text-[#b2883b] font-semibold border-b-2 border-[#b2883b] pb-0.5' : ''}`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('products')}
              className={`transition-colors hover:text-[#b2883b] ${activeTab === 'products' ? 'text-[#b2883b] font-semibold border-b-2 border-[#b2883b] pb-0.5' : ''}`}
            >
              All Products
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-1 hover:text-[#b2883b] transition-colors focus:outline-none"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-[#b2883b]' : ''}`} />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-lg shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Browse Collections</span>
                    <button 
                      onClick={() => handleCategoryClick('all')}
                      className="text-xs text-[#b2883b] hover:underline font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto py-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="w-full px-4 py-2.5 flex items-center justify-between text-left text-sm text-stone-800 hover:bg-[#fcf9f0] hover:text-[#b2883b] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="p-1 rounded bg-stone-100 group-hover:bg-white transition-colors">
                            {getCategoryIcon(cat.iconName)}
                          </span>
                          <span className="font-medium">{cat.name}</span>
                        </div>
                        <span className="text-xs text-stone-400 group-hover:text-[#b2883b]">
                          {cat.itemCount} items
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors hover:text-[#b2883b] ${activeTab === 'about' ? 'text-[#b2883b] font-semibold border-b-2 border-[#b2883b] pb-0.5' : ''}`}
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors hover:text-[#b2883b] ${activeTab === 'contact' ? 'text-[#b2883b] font-semibold border-b-2 border-[#b2883b] pb-0.5' : ''}`}
            >
              Contact Us
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Search, Wishlist, Track, Cart) */}
          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:p-2 text-stone-700 hover:text-[#b2883b] hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Search products"
              title="Search products"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-1.5 sm:p-2 text-stone-700 hover:text-[#b2883b] hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Wishlist"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#b2883b] text-white rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Order Tracking */}
            <button
              onClick={onOpenTrackOrder}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 border border-stone-300 rounded-md hover:border-[#b2883b] hover:text-[#b2883b] transition-colors"
              title="Track your order across Pakistan"
            >
              <PackageCheck className="w-3.5 h-3.5 text-[#b2883b]" />
              <span>Track Order</span>
            </button>

            {/* Authenticated Admin Dashboard & Sign Out (Visible only to authenticated admin) */}
            {isAdminAuthenticated && (
              <div className="hidden md:flex items-center gap-1.5 bg-[#fcf9f0] border border-[#d4af37] px-2 py-1 rounded-md">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-stone-900 hover:text-[#b2883b] transition-colors"
                  title="Open Admin Dashboard"
                >
                  <Shield className="w-3.5 h-3.5 text-[#b2883b]" />
                  <span>Admin</span>
                </button>
                <span className="text-stone-300">|</span>
                <button
                  onClick={logoutAdmin}
                  className="p-0.5 text-stone-400 hover:text-red-600 transition-colors"
                  title="Sign out of Admin session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#18181b] text-white rounded-md hover:bg-[#27272a] transition-all shadow-sm group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37]" />
              <span className="text-xs font-semibold tracking-wide hidden md:inline">Bag</span>
              <span className="bg-[#c5a059] text-[#18181b] font-bold text-[11px] sm:text-xs px-1.5 py-0.5 rounded-sm">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            {/* Mobile Header with Official Logo */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <button onClick={() => handleNavClick('home')} className="text-left">
                <Logo size="sm" />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-stone-600 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('home')}
                  className="w-full text-left py-2.5 px-3 rounded text-stone-900 font-semibold hover:bg-stone-100 flex items-center justify-between"
                >
                  <span>Home</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </button>
                <button
                  onClick={() => handleNavClick('products')}
                  className="w-full text-left py-2.5 px-3 rounded text-stone-900 font-semibold hover:bg-stone-100 flex items-center justify-between"
                >
                  <span>All Products</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenTrackOrder();
                  }}
                  className="w-full text-left py-2.5 px-3 rounded text-stone-900 font-semibold hover:bg-stone-100 flex items-center justify-between"
                >
                  <span>Track My Order (Pakistan)</span>
                  <PackageCheck className="w-4 h-4 text-[#b2883b]" />
                </button>
              </div>

              {/* Mobile Categories list */}
              <div className="pt-2 border-t border-stone-200">
                <p className="px-3 text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Featured Categories
                </p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="w-full text-left py-2 px-3 rounded text-sm text-stone-700 hover:bg-[#fcf9f0] hover:text-[#b2883b] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        {getCategoryIcon(cat.iconName)}
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-xs text-stone-400">{cat.itemCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-1">
                <button
                  onClick={() => handleNavClick('about')}
                  className="w-full text-left py-2 px-3 rounded text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                  About Zee Trends
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full text-left py-2 px-3 rounded text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                  Contact & Support
                </button>
                {isAdminAuthenticated && (
                  <div className="p-2 rounded bg-[#fcf9f0] border border-[#d4af37]/50 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAdminOpen(true);
                      }}
                      className="font-bold text-xs text-stone-900 flex items-center gap-1.5"
                    >
                      <Shield className="w-4 h-4 text-[#b2883b]" />
                      <span>Admin Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logoutAdmin();
                      }}
                      className="text-xs text-red-600 font-semibold hover:underline"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Footer WhatsApp Callout */}
            <div className="p-4 border-t border-stone-200 bg-stone-50">
              <a
                href={`https://wa.me/923240548272?text=Salam%20Zee%20Trends%20Store!%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366] text-white font-medium text-sm rounded-md flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp: +92 324 0548272</span>
              </a>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
