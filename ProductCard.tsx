import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Phone } from 'lucide-react';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';
import { formatPKR, generateWhatsAppUrl, createProductWhatsAppMessage } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuickView }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = createProductWhatsAppMessage(
      product.title,
      product.price,
      product.sku,
      product.colors ? product.colors[0] : undefined
    );
    window.open(generateWhatsAppUrl(msg), '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
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
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback pattern if image is hidden */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-stone-100 text-stone-400 font-serif text-lg">
          {product.category}
        </div>

        {/* Tags / Badges (Zero-pill discipline: unboxed clean tag or max 1 subtle badge) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.isTrending && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#18181b] px-2 py-0.5 rounded-sm shadow-xs">
              Trending
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#18181b] bg-[#e6ca65] px-2 py-0.5 rounded-sm shadow-xs">
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
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
            wishlisted
              ? 'bg-[#18181b] text-red-500'
              : 'bg-white/80 text-stone-600 hover:text-red-500 hover:bg-white'
          }`}
          aria-label="Save to Wishlist"
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
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
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Rating unboxed metadata with bullet */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-wider text-[11px] font-medium text-stone-500">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-[#b2883b] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-stone-500 line-clamp-1">
            {product.shortDesc}
          </p>
        </div>

        {/* Price & Primary Actions */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">
              {formatPKR(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatPKR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Bag + WhatsApp Quick Order */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-2 bg-[#18181b] text-white rounded text-xs font-semibold hover:bg-[#c5a059] hover:text-stone-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-2 px-2 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] rounded text-xs font-semibold hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="Quick WhatsApp Order"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
