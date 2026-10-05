import React from 'react';
import { ShoppingBag, Eye, Heart, Star, Phone } from 'lucide-react';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';
import { formatPKR, createProductWhatsAppMessage, generateWhatsAppUrl } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuickView }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = createProductWhatsAppMessage(
      product.title,
      product.price,
      product.sku
    );
    window.open(generateWhatsAppUrl(message), '_blank');
  };

  return (
    <div
      onClick={() => onOpenQuickView(product)}
      className="group relative bg-white rounded-xl border border-stone-200 overflow-hidden cursor-pointer hover:border-[#d4af37] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-[#fbfbf9] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = '/images/fallback-product.svg';
          }}
        />

        {/* Fallback pattern if image is hidden */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-stone-100 text-stone-400 font-serif text-lg">
          {product.category}
        </div>

        {/* Tags / Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.isTrending && (
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white bg-[#18181b] px-1.5 sm:px-2 py-0.5 rounded-xs shadow-xs">
              Trending
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#18181b] bg-[#e6ca65] px-1.5 sm:px-2 py-0.5 rounded-xs shadow-xs">
              Save {product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
            wishlisted
              ? 'bg-[#18181b] text-red-500'
              : 'bg-white/80 text-stone-600 hover:text-red-500 hover:bg-white'
          }`}
          aria-label="Save to Wishlist"
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick View Trigger (Floats up on desktop hover) */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="w-full py-2 bg-white/95 text-stone-900 border border-stone-300 rounded text-xs font-semibold hover:bg-[#18181b] hover:text-white transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Rating unboxed metadata with bullet */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-wider text-[10px] sm:text-[11px] font-medium text-stone-500 truncate mr-2">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs">{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#b2883b] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-[11px] sm:text-xs text-stone-500 line-clamp-1">
            {product.shortDesc}
          </p>
        </div>

        {/* Price & Primary Actions */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-2.5 sm:mb-3">
            <span className="text-sm sm:text-lg font-bold text-stone-900 tabular-nums">
              {formatPKR(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-stone-400 line-through tabular-nums">
                {formatPKR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons: Stack on mobile, grid on desktop to prevent overflow */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-2 bg-[#18181b] text-white rounded text-xs font-semibold hover:bg-[#c5a059] hover:text-stone-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Add to Bag</span>
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-2 px-2 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] rounded text-xs font-semibold hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="Quick WhatsApp Order"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
