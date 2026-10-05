import React from 'react';
import { X, ShieldCheck, Truck, RefreshCw, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_PHONE, STORE_EMAIL } from '../utils/formatters';

export const PolicyModal: React.FC = () => {
  const { activePolicyModal, setActivePolicyModal } = useStore();

  if (!activePolicyModal) return null;

  const content = {
    shipping: {
      title: 'Shipping & Delivery Policy',
      icon: Truck,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            At <strong>ZEE TRENDS STORE</strong>, we strive to deliver your orders promptly and safely across all regions of Pakistan.
          </p>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">1. Delivery Timelines:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Major Metros (Karachi, Lahore, Islamabad, Rawalpindi):</strong> 2 to 3 working days.</li>
              <li><strong>Other Cities & Regional Districts:</strong> 3 to 4 working days.</li>
              <li>Orders placed on Sundays or gazetted public holidays are processed the following working day.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">2. Shipping Charges:</h4>
            <p>
              We offer <strong>FREE EXPRESS DELIVERY</strong> on all orders totaling Rs. 3,500 or more. For orders below this amount, a nominal standard courier fee of Rs. 199 is charged.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">3. Cash on Delivery (COD):</h4>
            <p>
              Cash on Delivery is available across 120+ Pakistani cities. Please keep the exact payable cash ready when the courier rider arrives.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">4. Order Tracking:</h4>
            <p>
              Once your parcel is booked with our courier partners (Trax, TCS, Call Courier), you will receive a tracking code via SMS and WhatsApp. You can also track your parcel directly on our website.
            </p>
          </div>
        </div>
      )
    },
    return: {
      title: '7-Day Easy Exchange & Return Policy',
      icon: RefreshCw,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            Customer satisfaction is our highest priority. We offer a transparent <strong>7-Day Replacement Guarantee</strong> on all eligible items.
          </p>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">1. Conditions for Exchange:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>The item must be in its original packaging with all tags, seals, and accessories intact.</li>
              <li>Items damaged due to manufacturing defects or mishandling in transit are replaced free of charge.</li>
              <li>For watches, straps and movement defects are covered under warranty.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">2. How to Claim a Replacement:</h4>
            <p>
              Simply contact our WhatsApp customer helpline at <strong>{STORE_PHONE}</strong> or email <strong>{STORE_EMAIL}</strong> within 7 days of receiving your parcel. Provide your Order ID and brief photos/video showing the issue.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">3. Doorstep Pickup & Resolution:</h4>
            <p>
              Once verified, our rider will pick up the parcel from your doorstep and deliver the replacement at zero extra cost.
            </p>
          </div>
        </div>
      )
    },
    privacy: {
      title: 'Privacy & Data Protection Policy',
      icon: ShieldCheck,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            <strong>ZEE TRENDS STORE</strong> respects your personal privacy. We only collect the minimal information necessary to fulfill your orders and provide customer support.
          </p>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">1. Information We Collect:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Customer contact details: Full Name, WhatsApp / Phone number, Delivery Address, and City.</li>
              <li>Order history and communication transcripts for order fulfillment.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">2. How Information is Used:</h4>
            <p>
              Your contact details are shared exclusively with our courier delivery partners (e.g. Trax, TCS) to facilitate doorstep delivery and verification. We never sell or distribute your private information to third-party advertisers.
            </p>
          </div>
        </div>
      )
    },
    terms: {
      title: 'Terms & Conditions of Service',
      icon: FileText,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            By accessing or ordering from <strong>ZEE TRENDS STORE</strong>, you agree to the following terms:
          </p>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">1. Product Pricing & Availability:</h4>
            <p>
              All prices are listed in Pakistani Rupees (PKR) and are inclusive of standard local taxes. We make every effort to display accurate stock quantities; in the rare event of inventory exhaustion, our team will promptly contact you.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">2. Order Confirmation:</h4>
            <p>
              To prevent fraudulent bookings, our team may verify orders via SMS or WhatsApp before dispatching with the courier.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-1">3. Contact:</h4>
            <p>
              For legal or corporate queries: Phone/WhatsApp: {STORE_PHONE} | Email: {STORE_EMAIL}.
            </p>
          </div>
        </div>
      )
    }
  };

  const active = content[activePolicyModal];
  const Icon = active.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#fafaf9] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fcf9f0] border border-[#d4af37]/40 flex items-center justify-center text-[#b2883b]">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {active.title}
            </h3>
          </div>
          <button
            onClick={() => setActivePolicyModal(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {active.body}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 text-right">
          <button
            onClick={() => setActivePolicyModal(null)}
            className="px-5 py-2 bg-[#18181b] text-white rounded text-xs font-semibold hover:bg-[#b2883b] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
