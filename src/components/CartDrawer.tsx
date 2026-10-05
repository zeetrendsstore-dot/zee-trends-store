import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPKR, generateWhatsAppUrl, createCartWhatsAppMessage } from '../utils/formatters';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    total,
    freeShippingProgress,
    freeShippingRemaining,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
    setInputCoupon('');
  };

  const handleWhatsAppCartOrder = () => {
    const msg = createCartWhatsAppMessage(cart, total, shippingFee);
    window.open(generateWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#fafaf9]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#b2883b]" />
            <h2 className="font-serif text-lg font-bold text-stone-900">Your Shopping Bag</h2>
            <span className="text-xs bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#fcf9f0] border-b border-[#e4ce88]/40 px-5 py-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#b2883b]" />
              {freeShippingRemaining === 0 ? (
                <span className="text-emerald-700 font-bold">🎉 FREE Delivery unlocked!</span>
              ) : (
                <span>Add <strong>{formatPKR(freeShippingRemaining)}</strong> more for FREE Delivery</span>
              )}
            </span>
            <span className="text-stone-500 font-medium">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#b2883b] h-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-stone-800">Your bag is empty</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Explore our curated catalog of watches, wallets, beauty serums & everyday useful essentials.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-2.5 bg-[#18181b] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#b2883b] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor || index}`}
                className="flex gap-3.5 p-3 rounded-lg border border-stone-200 bg-[#fafaf9] hover:border-stone-300 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-md overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                        className="text-stone-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedColor && (
                      <p className="text-[11px] text-stone-500 font-medium">
                        Variant: {item.selectedColor}
                      </p>
                    )}

                    <p className="text-xs font-bold text-stone-900 tabular-nums mt-0.5">
                      {formatPKR(item.product.price)}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                    <div className="flex items-center border border-stone-300 rounded bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)
                        }
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)
                        }
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-stone-900 tabular-nums">
                      {formatPKR(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Billing & CTAs */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#fafaf9] space-y-3.5">
            {/* Promo Code Input */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-200">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{couponCode}' applied! (-{formatPKR(discountAmount)})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-stone-400 hover:text-stone-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (try ZEE10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs uppercase border border-stone-300 rounded bg-white focus:outline-none focus:border-[#b2883b]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-bold hover:bg-[#b2883b] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums text-stone-900">{formatPKR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-semibold tabular-nums">-{formatPKR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery across Pakistan</span>
                <span className="font-semibold tabular-nums text-stone-900">
                  {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : formatPKR(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                <span>Estimated Total</span>
                <span className="text-base text-stone-900 tabular-nums">{formatPKR(total)}</span>
              </div>
            </div>

            {/* Trust COD Banner */}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cash on Delivery (COD) supported nationwide</span>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-[#18181b] text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#c5a059] hover:text-stone-900 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT (COD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCartOrder}
                className="w-full py-2.5 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] rounded-md text-xs font-bold uppercase tracking-wider hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Order Bag via WhatsApp</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
