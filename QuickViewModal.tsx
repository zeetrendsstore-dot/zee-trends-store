import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Phone, 
  Check, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Heart,
  Plus,
  Minus
} from 'lucide-react';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';
import { formatPKR, generateWhatsAppUrl, createProductWhatsAppMessage } from '../utils/formatters';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onInstantBuy: (product: Product, quantity: number, selectedColor?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onInstantBuy
}) => {
  const { products, setQuickViewProduct, addToCart, toggleWishlist, isWishlisted, reviews } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors ? product.colors[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  const wishlisted = isWishlisted(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isTrending))
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleWhatsAppOrder = () => {
    const msg = createProductWhatsAppMessage(
      product.title,
      product.price,
      product.sku,
      selectedColor
    );
    window.open(generateWhatsAppUrl(msg), '_blank');
  };

  const handleBuyNow = () => {
    onInstantBuy(product, quantity, selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-stone-100 flex items-center justify-between bg-[#fafaf9]">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-500 font-medium">
            <span className="uppercase tracking-wider text-stone-400">SKU: {product.sku}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">
              {product.inStock ? 'In Stock (Ready to Dispatch)' : 'Out of Stock'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/images/fallback-product.svg';
                }}
              />
              {product.discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-[#e6ca65] text-stone-900 text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                  Save {product.discountPercent}% OFF
                </div>
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 p-2.5 rounded-full shadow-sm ${
                  wishlisted ? 'bg-[#18181b] text-red-500' : 'bg-white/90 text-stone-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail previews */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-[#b2883b] ring-2 ring-[#b2883b]/20' : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/fallback-product.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Nationwide Trust Bar */}
            <div className="p-3.5 rounded-lg bg-[#fafaf9] border border-stone-200/80 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#b2883b]" />
                <span>Cash on Delivery available in 120+ Pakistani cities</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#b2883b]" />
                <span>7-Day Doorstep Replacement Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#b2883b]" />
                <span>Open & Inspect parcel before rider payment</span>
              </div>
            </div>
          </div>

          {/* Right Column: PDP Purchasing Module */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-800">{product.rating}</span>
                <span className="text-xs text-stone-400">({product.reviewCount} customer reviews)</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-stone-900 leading-tight">
                {product.title}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-stone-900 tabular-nums">
                  {formatPKR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {formatPKR(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Free Delivery Eligibility
                </span>
              </div>

              {/* Short Desc */}
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                {product.shortDesc}
              </p>

              {/* Color / Variant Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Select Variant / Color: <span className="text-stone-900 font-semibold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                          selectedColor === color
                            ? 'border-[#b2883b] bg-[#fcf9f0] text-stone-900 ring-1 ring-[#b2883b]'
                            : 'border-stone-200 text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-stone-300 rounded-md bg-stone-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-stone-600 hover:text-stone-900 focus:outline-none"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-stone-600 hover:text-stone-900 focus:outline-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs: Add to Cart, Buy Now COD, Direct WhatsApp Order */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 bg-[#18181b] text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-[#c5a059] hover:text-stone-900 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 bg-[#b2883b] text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-[#8f6927] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Buy Now (COD)</span>
                </button>
              </div>

              {/* Direct WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3 px-4 bg-[#25D366] text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-[#1ebc59] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Order Directly on WhatsApp</span>
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Tabbed Details: Full Description, Specs, Reviews */}
        <div className="border-t border-stone-200 bg-[#fafaf9] p-6 lg:p-8">
          <div className="flex border-b border-stone-200 gap-6 mb-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'details'
                  ? 'border-b-2 border-[#b2883b] text-[#b2883b]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Description & Highlights
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'specs'
                  ? 'border-b-2 border-[#b2883b] text-[#b2883b]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-[#b2883b] text-[#b2883b]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Reviews ({productReviews.length})
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <p>{product.description}</p>
              <div className="pt-2">
                <h4 className="font-bold text-stone-900 mb-2">Key Features:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="p-2.5 bg-white rounded border border-stone-200 flex justify-between">
                  <span className="text-stone-500 font-medium">{key}</span>
                  <span className="text-stone-900 font-semibold">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-white rounded border border-stone-200 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{rev.author}</span>
                        <span className="text-stone-400">({rev.city})</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600 italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500">No verified reviews for this specific item yet. Be the first to review!</p>
              )}
            </div>
          )}
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="p-6 lg:p-8 border-t border-stone-200 bg-white">
            <h4 className="font-serif text-base font-bold text-stone-900 mb-4">
              Frequently Bought Together & Related Items
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setQuickViewProduct(rel);
                    setSelectedImageIndex(0);
                    setSelectedColor(rel.colors ? rel.colors[0] : undefined);
                  }}
                  className="p-3 rounded-lg border border-stone-200 hover:border-[#d4af37] transition-all cursor-pointer flex gap-3 group bg-[#fafaf9]"
                >
                  <div className="w-16 h-16 rounded overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={rel.images[0]}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h5 className="font-serif text-xs font-bold text-stone-900 truncate group-hover:text-[#b2883b]">
                        {rel.title}
                      </h5>
                      <span className="text-[10px] text-stone-400 capitalize">{rel.category.replace('-', ' ')}</span>
                    </div>
                    <span className="text-xs font-bold text-stone-900 tabular-nums">
                      {formatPKR(rel.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
