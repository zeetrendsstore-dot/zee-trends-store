import React, { useState } from 'react';
import { Phone, X, MessageSquare, Send } from 'lucide-react';
import { STORE_PHONE, generateWhatsAppUrl } from '../utils/formatters';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim() || 'Salam Zee Trends Store! I need assistance with an order.';
    window.open(generateWhatsAppUrl(text), '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end">
      {/* Popover Mini Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#128C7E] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-sm">
                  ZT
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">ZEE TRENDS STORE</h4>
                <p className="text-[11px] text-emerald-100">Typically replies in 15 mins</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Bubble Message */}
          <div className="p-4 bg-[#ece5dd] text-xs space-y-2">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-xs max-w-[90%] text-stone-800">
              <p className="font-semibold text-stone-900 mb-0.5">Assalam-o-Alaikum! 👋</p>
              <p className="text-stone-600 leading-relaxed">
                Welcome to Zee Trends Store! How can we assist you with our watches, wallets, skincare, or Cash on Delivery today?
              </p>
              <span className="text-[10px] text-stone-400 block text-right mt-1">Just now</span>
            </div>
          </div>

          {/* Message form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-full focus:outline-none focus:border-[#128C7E]"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#128C7E] text-white flex items-center justify-center hover:bg-[#075E54] transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#25D366] text-white font-semibold text-xs rounded-full shadow-xl hover:bg-[#20ba59] transition-all hover:scale-105 cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
        <span className="hidden sm:inline font-bold">WhatsApp: {STORE_PHONE}</span>
      </button>
    </div>
  );
};
