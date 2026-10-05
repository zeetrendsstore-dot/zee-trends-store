import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Phone, 
  Building2, 
  CreditCard, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { useStore, PlacedOrder } from '../context/StoreContext';
import { PAKISTANI_CITIES, PAKISTANI_PROVINCES } from '../data/products';
import { formatPKR, generateWhatsAppUrl, STORE_PHONE } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTrackOrder: () => void;
  instantProduct?: {
    product: any;
    quantity: number;
    selectedColor?: string;
  } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOpenTrackOrder,
  instantProduct
}) => {
  const { cart, subtotal, shippingFee, discountAmount, total, placeOrder } = useStore();

  const checkoutItems = instantProduct
    ? [instantProduct]
    : cart;

  const currentSubtotal = instantProduct
    ? instantProduct.product.price * instantProduct.quantity
    : subtotal;

  const currentShipping = currentSubtotal >= 3500 || currentSubtotal === 0 ? 0 : 199;
  const currentTotal = Math.max(0, currentSubtotal - (instantProduct ? 0 : discountAmount) + currentShipping);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(PAKISTANI_CITIES[0]);
  const [province, setProvince] = useState(PAKISTANI_PROVINCES[0]);
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');

  // Completed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) return;

    const order = placeOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      city: city,
      province: province,
      address: address.trim(),
      postalCode: postalCode.trim() || undefined,
      notes: notes.trim() || undefined,
      paymentMethod: paymentMethod,
      items: checkoutItems,
      subtotal: currentSubtotal,
      discount: instantProduct ? 0 : discountAmount,
      shipping: currentShipping,
      total: currentTotal,
    });

    setConfirmedOrder(order);
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!confirmedOrder) return;
    const msg = `Salam Zee Trends Store! ✨
I just placed Order *#${confirmedOrder.orderId}* on your website.

📦 *Order Details:*
👤 Name: ${confirmedOrder.customerName}
📞 Phone: ${confirmedOrder.phone}
📍 City: ${confirmedOrder.city}
🏠 Address: ${confirmedOrder.address}
💵 Total Amount: ${formatPKR(confirmedOrder.total)}
💳 Payment: ${confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer'}

Please confirm receipt and dispatch schedule. Thank you!`;
    window.open(generateWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#fafaf9] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#b2883b]" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              {confirmedOrder ? 'Order Confirmed!' : 'Secure Pakistani Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {confirmedOrder ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#b2883b]">
                Shukriya for shopping with Zee Trends!
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Order #{confirmedOrder.orderId} Placed
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                A verification SMS and WhatsApp update will be sent to <strong>{confirmedOrder.phone}</strong>.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-4 rounded-xl bg-[#fafaf9] border border-stone-200 text-left text-xs sm:text-sm space-y-2">
              <div className="flex justify-between font-semibold border-b border-stone-200/80 pb-2">
                <span>Tracking Number</span>
                <span className="text-[#b2883b] font-mono">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Recipient:</span>
                <span className="font-medium text-stone-900">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Destination:</span>
                <span className="font-medium text-stone-900">{confirmedOrder.city}, Pakistan</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Payment Mode:</span>
                <span className="font-medium text-stone-900">
                  {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Pay to Rider)' : 'Direct Bank Transfer'}
                </span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200/80 pt-2 text-base">
                <span>Total Amount:</span>
                <span className="tabular-nums">{formatPKR(confirmedOrder.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleSendWhatsAppConfirmation}
                className="flex-1 py-3 px-4 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#1ebc59] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenTrackOrder();
                }}
                className="flex-1 py-3 px-4 bg-[#18181b] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#b2883b] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track This Order</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            
            {/* Order Items Preview */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <p className="font-bold text-stone-800 uppercase tracking-wider mb-2">Order Items:</p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-700">
                    <span className="line-clamp-1 font-medium">
                      {item.product.title} (x{item.quantity}{item.selectedColor ? `, ${item.selectedColor}` : ''})
                    </span>
                    <span className="font-bold text-stone-900 tabular-nums shrink-0 ml-2">
                      {formatPKR(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                <span>Total Payable:</span>
                <span className="text-sm tabular-nums">{formatPKR(currentTotal)}</span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                <span>1. Shipping & Customer Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Hamza"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0324 0548272 or +92 3XX XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Destination City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  >
                    {PAKISTANI_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Province / Region *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  >
                    {PAKISTANI_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Postal Code / Zip Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 54000, 75500, 44000"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House / Flat No., Street, Sector / Area / Colony, Nearest Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery, deliver after 2 PM"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <h3 className="font-serif text-base font-bold text-stone-900">
                2. Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: COD */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#b2883b] bg-[#fcf9f0] ring-1 ring-[#b2883b]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-[#b2883b]" />
                    <span className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Pay cash to the rider when the parcel arrives at your doorstep. Inspect before pay.
                  </p>
                </div>

                {/* Option 2: Bank Transfer */}
                <div
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#b2883b] bg-[#fcf9f0] ring-1 ring-[#b2883b]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-[#b2883b]" />
                    <span className="text-xs font-bold text-stone-900">Direct Bank Transfer</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Meezan / HBL / Nayapay / Easypaisa. Share receipt screenshot on WhatsApp.
                  </p>
                </div>
              </div>

              {paymentMethod === 'bank_transfer' && (
                <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs text-stone-700 space-y-1">
                  <p className="font-bold text-stone-900">Bank Account Details:</p>
                  <p>Bank: Meezan Bank Ltd.</p>
                  <p>Account Title: ZEE TRENDS STORE</p>
                  <p>IBAN: PK42MEZN00019283746501</p>
                  <p className="text-stone-500 text-[11px]">Send receipt to WhatsApp: {STORE_PHONE}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#18181b] text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#c5a059] hover:text-stone-900 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>CONFIRM ORDER ({formatPKR(currentTotal)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-stone-400 mt-2">
                🔒 Guaranteed 7-day hassle-free replacement across Pakistan
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
