import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  ChevronDown, 
  Send, 
  CheckCircle2,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';
import { STORE_PHONE, STORE_EMAIL, generateWhatsAppUrl } from '../utils/formatters';
import { useStore } from '../context/StoreContext';

export const ContactSection: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setIsSubmitted(true);
    showToast('Message sent! Our customer team will get back to you shortly.');
  };

  const faqs = [
    {
      q: 'How long does delivery take across Pakistan?',
      a: 'Deliveries to major cities like Karachi, Lahore, Islamabad, and Rawalpindi typically take 2 to 3 business days. For other towns and regional districts, delivery takes 3 to 4 business days via our partner couriers (Trax, TCS, Call Courier).'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes! Cash on Delivery is available across 120+ cities, towns, and tehsils in Pakistan. You pay the rider in cash when your parcel is delivered at your doorstep.'
    },
    {
      q: 'Can I open and inspect the package before paying?',
      a: 'Absolutely. We encourage customers to inspect the outer flyer and seal. If you ever find any defect, our 7-day hassle-free replacement guarantee protects your purchase completely.'
    },
    {
      q: 'How do I place an order directly on WhatsApp?',
      a: 'Simply click any "Order on WhatsApp" button or message us directly at +92 324 0548272. Send us the product name or photo along with your delivery address, and our team will book your order immediately.'
    },
    {
      q: 'What is your 7-Day Exchange & Return policy?',
      a: 'If your item has a manufacturing defect, damaged bottle, or functional issue, WhatsApp us within 7 days with photos/video. We will arrange a doorstep exchange or refund.'
    }
  ];

  return (
    <div className="bg-[#fafaf9] py-16 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#b2883b] mb-1">
            Always At Your Service
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Contact & Support
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Have a question about a product, delivery status, or custom order? Reach out through any of our official channels.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          {/* Card 1: Phone / WhatsApp */}
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-[#d4af37] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              WhatsApp & Phone
            </h3>
            <p className="text-xs text-stone-500 mb-3">Direct customer hotline</p>
            <a
              href={generateWhatsAppUrl('Salam Zee Trends! I have a question.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-700 hover:underline block"
            >
              {STORE_PHONE}
            </a>
          </div>

          {/* Card 2: Email */}
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-[#d4af37] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#fcf9f0] text-[#b2883b] border border-[#d4af37]/40 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              Official Email
            </h3>
            <p className="text-xs text-stone-500 mb-3">Support & corporate inquiries</p>
            <a
              href={`mailto:${STORE_EMAIL}`}
              className="text-xs font-bold text-stone-900 hover:text-[#b2883b] hover:underline block truncate"
            >
              {STORE_EMAIL}
            </a>
          </div>

          {/* Card 3: Timings */}
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-[#d4af37] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              Service Hours
            </h3>
            <p className="text-xs text-stone-500 mb-1">Monday – Saturday</p>
            <p className="text-xs font-semibold text-stone-800">10:00 AM – 10:00 PM (PST)</p>
          </div>

          {/* Card 4: Location */}
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-[#d4af37] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              Dispatch Hub
            </h3>
            <p className="text-xs text-stone-500 mb-1">Central Logistics</p>
            <p className="text-xs font-semibold text-stone-800">Lahore / Karachi, Pakistan</p>
          </div>

        </div>

        {/* 2-Column: Inquiry Form + Official Socials & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Inquiry Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Fill out this form and our support team will reply within a few hours.
            </p>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-emerald-900">Message Received!</h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you for reaching out. We will contact you at {phone || email} very soon.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bilal Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 3XX XXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="bilal@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Message / Inquiry Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ask about product availability, bulk ordering, or delivery timelines..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#18181b] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#b2883b] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Social Presence & FAQs */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Official Social Channels Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-2xs">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Connect on Official Channels
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Follow our official social pages for daily new drops, unboxing videos, and exclusive discounts:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <a
                  href="https://instagram.com/zeet.rendsstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-stone-200 hover:border-[#d4af37] flex items-center gap-2.5 transition-colors group"
                >
                  <Instagram className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block font-semibold text-stone-900">Instagram</span>
                    <span className="text-[11px] text-stone-400">@zeet.rendsstore</span>
                  </div>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-stone-200 hover:border-[#d4af37] flex items-center gap-2.5 transition-colors group"
                >
                  <Facebook className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block font-semibold text-stone-900">Facebook</span>
                    <span className="text-[11px] text-stone-400">ZEE TRENDS STORE</span>
                  </div>
                </a>

                <a
                  href="https://pinterest.com/zeetrendsstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-stone-200 hover:border-[#d4af37] flex items-center gap-2.5 transition-colors group"
                >
                  <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[10px] group-hover:scale-110 transition-transform">
                    P
                  </div>
                  <div>
                    <span className="block font-semibold text-stone-900">Pinterest</span>
                    <span className="text-[11px] text-stone-400">@zeetrendsstore</span>
                  </div>
                </a>

                <a
                  href="https://threads.net/@zeetrendsstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-stone-200 hover:border-[#d4af37] flex items-center gap-2.5 transition-colors group"
                >
                  <div className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[10px] group-hover:scale-110 transition-transform">
                    @
                  </div>
                  <div>
                    <span className="block font-semibold text-stone-900">Threads</span>
                    <span className="text-[11px] text-stone-400">@zeetrendsstore</span>
                  </div>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 p-3 rounded-lg border border-stone-200 hover:border-[#d4af37] flex items-center gap-2.5 transition-colors group"
                >
                  <Linkedin className="w-4 h-4 text-sky-700 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block font-semibold text-stone-900">LinkedIn</span>
                    <span className="text-[11px] text-stone-400">Zee Trends</span>
                  </div>
                </a>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Frequently Asked Questions
              </h3>

              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-stone-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-4 py-3 text-left font-serif text-sm font-bold text-stone-900 flex items-center justify-between hover:bg-stone-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-400 transition-transform ${
                          openFaq === index ? 'rotate-180 text-[#b2883b]' : ''
                        }`}
                      />
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-3 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-2 bg-[#fafaf9]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
