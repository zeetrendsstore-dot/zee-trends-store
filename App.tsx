import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { FeaturedProducts } from './components/FeaturedProducts';
import { BestSellersSection } from './components/BestSellersSection';
import { PromoSection } from './components/PromoSection';
import { TrustBadges } from './components/TrustBadges';
import { ReviewsSection } from './components/ReviewsSection';
import { AllProductsView } from './components/AllProductsView';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { WishlistModal } from './components/WishlistModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminLoginPage } from './components/AdminLoginPage';
import { PolicyModal } from './components/PolicyModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AiShoppingAssistant } from './components/AiShoppingAssistant';
import { Product } from './data/products';

const StoreContent: React.FC = () => {
  const { 
    activeTab, 
    quickViewProduct, 
    setQuickViewProduct,
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    isAdminAuthenticated,
    openAdminPortal,
    toastMessage
  } = useStore();

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [instantBuyProduct, setInstantBuyProduct] = useState<{
    product: Product;
    quantity: number;
    selectedColor?: string;
  } | null>(null);

  // Detect whether the current URL is /admin or /admin/login or #admin
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path === '/admin' ||
      path === '/admin/' ||
      path === '/admin/login' ||
      path === '/admin/login/' ||
      hash === '#admin' ||
      hash === '#admin/login' ||
      hash === '#/admin' ||
      hash === '#/admin/login'
    );
  });

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const matchesAdmin = (
        path === '/admin' ||
        path === '/admin/' ||
        path === '/admin/login' ||
        path === '/admin/login/' ||
        hash === '#admin' ||
        hash === '#admin/login' ||
        hash === '#/admin' ||
        hash === '#/admin/login'
      );
      setIsAdminRoute(matchesAdmin);
      if (matchesAdmin && isAdminAuthenticated) {
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, [isAdminAuthenticated]);

  // Secret keyboard shortcut (Ctrl+Shift+A or Alt+A) for store owner
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        openAdminPortal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleInstantBuy = (product: Product, quantity: number, selectedColor?: string) => {
    setInstantBuyProduct({ product, quantity, selectedColor });
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckout = () => {
    setInstantBuyProduct(null);
    setIsCheckoutOpen(true);
  };

  const scrollToTrending = () => {
    const el = document.getElementById('trending-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If navigating directly to /admin or /admin/login and unauthenticated:
  // Render the dedicated Admin Login Page!
  if (isAdminRoute && !isAdminAuthenticated) {
    return (
      <AdminLoginPage 
        onBackToStore={() => {
          window.history.pushState({}, '', '/');
          window.location.hash = '';
          setIsAdminRoute(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#b2883b] selection:text-white flex flex-col">
      {/* Header */}
      <Header
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero onExploreClick={scrollToTrending} />
            <FeaturedCategories />
            <div id="trending-section">
              <FeaturedProducts
                onOpenQuickView={handleOpenQuickView}
              />
            </div>
            <PromoSection />
            <BestSellersSection
              onOpenQuickView={handleOpenQuickView}
            />
            <TrustBadges />
            <ReviewsSection />
          </>
        )}

        {activeTab === 'products' && (
          <AllProductsView
            onOpenQuickView={handleOpenQuickView}
          />
        )}

        {activeTab === 'about' && <AboutSection />}

        {activeTab === 'contact' && <ContactSection />}
      </main>

      {/* Footer */}
      <Footer onOpenTrackOrder={() => setIsTrackOrderOpen(true)} />

      {/* Floating WhatsApp Action Widget */}
      <FloatingWhatsApp />

      {/* Optional AI Shopping Assistant Widget */}
      <AiShoppingAssistant />

      {/* Product Quick View / PDP Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onInstantBuy={handleInstantBuy}
        />
      )}

      {/* Shopping Bag / Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Cash On Delivery Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        instantProduct={instantBuyProduct}
      />

      {/* Search Modal with AI Natural Language Search */}
      <SearchModal onSelectProduct={handleOpenQuickView} />

      {/* Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onOpenQuickView={handleOpenQuickView}
      />

      {/* Admin Panel / Product Management */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (isAdminRoute) {
            window.history.pushState({}, '', '/');
            window.location.hash = '';
            setIsAdminRoute(false);
          }
        }}
      />

      {/* Secure Admin Login Modal (Triggered via shortcut or session expiry) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* Policy Modal (Shipping, Return, Privacy, Terms) */}
      <PolicyModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#18181b] text-white rounded-md text-xs font-semibold shadow-xl border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
