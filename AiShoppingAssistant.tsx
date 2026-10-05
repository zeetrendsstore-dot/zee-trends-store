import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ShoppingBag, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../data/products';
import { formatPKR } from '../utils/formatters';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedProducts?: Product[];
}

export const AiShoppingAssistant: React.FC = () => {
  const { products, setQuickViewProduct } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessage: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: "Assalam-o-Alaikum! I'm your ZEE TRENDS AI Shopping Assistant. Tell me what you're looking for, your budget in PKR, or ask any question about our verified products!",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Wallets under Rs. 2,000',
    'Skincare product for oily or acne skin',
    'Men luxury chronograph watch',
    'Best trending gifts under Rs. 3,500'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/shopping-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      if (!res.ok) throw new Error('AI service error');

      const data = await res.json();
      
      const suggestedProducts = (data.suggestedProductIds || [])
        .map((id: string) => products.find((p) => p.id === id))
        .filter(Boolean) as Product[];

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.text,
        suggestedProducts: suggestedProducts.length > 0 ? suggestedProducts : undefined
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Local fallback in case network disconnects
      const q = messageText.toLowerCase();
      const matched = products.filter((p) => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => q.includes(t.toLowerCase()))
      ).slice(0, 3);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: "Assalam-o-Alaikum! Here are items from our catalog matching your request. Cash on delivery is available nationwide across Pakistan.",
          suggestedProducts: matched.length > 0 ? matched : undefined
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([initialMessage]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#18181b] to-[#27272a] text-white rounded-full shadow-xl hover:shadow-2xl border border-[#d4af37]/60 hover:scale-105 transition-all group cursor-pointer"
            title="Ask AI Shopping Assistant"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#d4af37] text-stone-950 flex items-center justify-center font-bold text-xs animate-pulse shrink-0">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold tracking-wide">
              AI Assistant
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-[420px] max-h-[85vh] h-[540px] sm:h-[580px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#18181b] text-white flex items-center justify-between border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#b2883b] text-stone-950 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                  <span>ZEE TRENDS AI Assistant</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] font-sans font-semibold border border-[#d4af37]/40">
                    Gemini
                  </span>
                </h3>
                <p className="text-[11px] text-stone-400">
                  Smart recommendations from our verified catalog
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-stone-50 border-b border-stone-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="px-2.5 py-1 bg-white hover:bg-[#fcf9f0] border border-stone-200 hover:border-[#d4af37] text-stone-700 hover:text-stone-900 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                ✨ {prompt}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fafaf9]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#18181b] text-[#d4af37] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#18181b] text-white rounded-tr-xs'
                        : 'bg-white text-stone-800 border border-stone-200/80 shadow-xs rounded-tl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Render Suggested Product Cards */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Recommended from Store:
                      </span>
                      <div className="space-y-2">
                        {msg.suggestedProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setQuickViewProduct(p)}
                            className="p-2.5 bg-white rounded-xl border border-stone-200 hover:border-[#d4af37] transition-all cursor-pointer flex items-center gap-3 shadow-xs hover:shadow-sm group"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200"
                              onError={(e) => {
                                e.currentTarget.src = '/images/fallback-product.svg';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-xs font-bold text-stone-900 truncate group-hover:text-[#b2883b]">
                                {p.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-bold text-[#b2883b]">
                                  {formatPKR(p.price)}
                                </span>
                                {p.originalPrice > p.price && (
                                  <span className="text-[10px] text-stone-400 line-through">
                                    {formatPKR(p.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 text-stone-400 group-hover:text-[#b2883b]">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#d4af37] text-stone-950 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#18181b] text-[#d4af37] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-white rounded-2xl rounded-tl-xs border border-stone-200 text-xs text-stone-500 flex items-center gap-2 shadow-xs">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                  <span>Searching store catalog & analyzing products...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-stone-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about watches, skincare, gifts, budget..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#b2883b] focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-[#18181b] text-white rounded-xl hover:bg-[#b2883b] transition-colors cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-stone-400 text-center mt-1.5">
              Cash on Delivery (COD) nationwide • Powered by Gemini AI
            </p>
          </div>

        </div>
      )}
    </>
  );
};
