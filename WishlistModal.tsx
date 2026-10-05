import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../data/products';
import { formatPKR } from '../utils/formatters';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickView: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onOpenQuickView
}) => {
  const { products, wishlist, toggleWishlist, addToCart } = useStore();

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#fafaf9]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <h2 className="font-serif text-lg font-bold text-stone-900">Saved Wishlist</h2>
            <span className="text-xs bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-full">
              {wishlistedProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="py-20 text-center">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-stone-800">Your wishlist is empty</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Save your favorite trending watches, perfumes, leather wallets or gadgets to review later.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3.5 p-3 rounded-lg border border-stone-200 bg-[#fafaf9] hover:border-stone-300 transition-colors"
              >
                <div
                  onClick={() => {
                    onClose();
                    onOpenQuickView(product);
                  }}
                  className="w-20 h-20 rounded-md overflow-hidden bg-stone-100 shrink-0 border border-stone-200 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        onClick={() => {
                          onClose();
                          onOpenQuickView(product);
                        }}
                        className="font-serif text-sm font-bold text-stone-900 line-clamp-1 cursor-pointer hover:text-[#b2883b]"
                      >
                        {product.title}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-stone-900 tabular-nums mt-1">
                      {formatPKR(product.price)}
                    </p>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                      }}
                      className="flex-1 py-1.5 px-2 bg-[#18181b] text-white rounded text-xs font-semibold hover:bg-[#b2883b] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:border-stone-400"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
