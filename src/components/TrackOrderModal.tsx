import React, { useState } from 'react';
import { 
  X, 
  Search, 
  PackageCheck, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone,
  AlertCircle
} from 'lucide-react';
import { useStore, PlacedOrder } from '../context/StoreContext';
import { formatPKR, generateWhatsAppUrl, STORE_PHONE } from '../utils/formatters';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<PlacedOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    const clean = query.trim().toLowerCase();

    const match = orders.find(
      (o) =>
        o.orderId.toLowerCase() === clean ||
        o.orderId.replace('-', '').toLowerCase() === clean.replace('-', '') ||
        o.phone.includes(clean) ||
        o.trackingNumber.toLowerCase() === clean
    );

    setSearchedOrder(match || null);
  };

  const steps = [
    { label: 'Order Booked', desc: 'Received & verified by Zee Trends team', icon: CheckCircle2, status: 'done' },
    { label: 'Quality Checked & Packed', desc: 'Tested, bubble-wrapped and sealed', icon: PackageCheck, status: 'done' },
    { label: 'In-Transit with Courier', desc: 'Handed over to Trax / TCS Logistics', icon: Truck, status: 'active' },
    { label: 'Out for Delivery', desc: 'Rider arriving at your destination address', icon: MapPin, status: 'pending' },
    { label: 'Delivered (COD Received)', desc: 'Parcel safely handed over', icon: Clock, status: 'pending' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#fafaf9] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#b2883b]" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Track Nationwide Delivery
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6">
          <form onSubmit={handleTrack} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Enter Order ID or WhatsApp Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. ZT-9482 or 03240548272"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#18181b] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#b2883b] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>Track</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-400">
              Tip: You can test with demo order ID <strong className="text-stone-700">ZT-9482</strong>
            </p>
          </form>

          {/* Results Area */}
          {hasSearched && (
            <div className="mt-6 pt-6 border-t border-stone-200">
              {searchedOrder ? (
                <div className="space-y-6">
                  {/* Order Overview */}
                  <div className="p-4 rounded-xl bg-[#fafaf9] border border-stone-200 text-xs sm:text-sm space-y-1.5">
                    <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-stone-400">Order ID:</span>
                        <h4 className="font-bold text-stone-900 text-base">{searchedOrder.orderId}</h4>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold text-xs">
                        Status: {searchedOrder.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-stone-600">
                      <div>
                        <span className="text-stone-400 block text-[11px]">Recipient:</span>
                        <span className="font-medium text-stone-900">{searchedOrder.customerName}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">City:</span>
                        <span className="font-medium text-stone-900">{searchedOrder.city}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">Courier Tracking:</span>
                        <span className="font-mono font-medium text-stone-900">{searchedOrder.trackingNumber}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">Total COD:</span>
                        <span className="font-bold text-stone-900 tabular-nums">{formatPKR(searchedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Timeline Steps */}
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold text-stone-900">
                      Live Delivery Progress
                    </h4>
                    <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                      {steps.map((st, i) => {
                        const Icon = st.icon;
                        const isDone = i < 3;
                        const isCurrent = i === 2;
                        return (
                          <div key={i} className="relative flex items-start gap-3 text-xs">
                            <div
                              className={`absolute -left-6 w-4 h-4 rounded-full flex items-center justify-center ${
                                isDone
                                  ? 'bg-[#b2883b] text-white ring-4 ring-white'
                                  : 'bg-stone-200 text-stone-400 ring-4 ring-white'
                              }`}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                            <div>
                              <p className={`font-bold ${isCurrent ? 'text-[#b2883b]' : 'text-stone-900'}`}>
                                {st.label} {isCurrent && <span className="text-[10px] bg-[#fcf9f0] border border-[#d4af37] px-1.5 py-0.2 rounded ml-1">Current Stage</span>}
                              </p>
                              <p className="text-stone-500 text-[11px]">{st.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* WhatsApp Support Callout */}
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                    <span className="text-stone-600">Need delivery assistance?</span>
                    <a
                      href={generateWhatsAppUrl(`Salam! I need an update regarding Order #${searchedOrder.orderId}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Support</span>
                    </a>
                  </div>

                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                  <p className="font-bold text-amber-900 text-sm">No Order Found</p>
                  <p className="text-xs text-amber-700 max-w-sm mx-auto">
                    We could not find an order matching "{query}". Please double-check your Order ID or reach out to our WhatsApp team for manual assistance.
                  </p>
                  <a
                    href={generateWhatsAppUrl(`Salam! I am trying to track my order for phone: ${query}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline pt-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Check with WhatsApp Team ({STORE_PHONE})</span>
                  </a>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
