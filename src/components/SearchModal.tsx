import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Star, Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../data/products';
import { formatPKR } from '../utils/formatters';

interface SearchModalProps {
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onSelectProduct }) => {
  const { products, isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, setActiveTab } = useStore();
  const [searchMode, setSearchMode] = useState<'standard' | 'ai'>('standard');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiMatchedIds, setAiMatchedIds] = useState<string[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setAiExplanation(null);
      setAiMatchedIds(null);
    }
  }, [isSearchOpen]);

  // Standard Keyword Search Results
  const standardResults = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.shortDesc.toLowerCase().includes(q)
        );
      })
    : products.slice(0, 4);

  // AI Semantic Natural Language Search
  const handleAiSearch = async (queryText?: string) => {
    const text = (queryText || searchQuery).trim();
    if (!text) return;

    setAiLoading(true);
    setSearchMode('ai');
    if (queryText) setSearchQuery(queryText);

    try {
      const res = await fetch('/api/ai/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });

      if (!res.ok) throw new Error('AI search failed');
      const data = await res.json();

      setAiMatchedIds(data.productIds || []);
      setAiExplanation(data.explanation || null);
    } catch {
      // Heuristic fallback
      const q = text.toLowerCase();
      const budgetMatch = q.match(/(?:under|below|less than|upto|up to)\s*(?:rs\.?|pkr)?\s*(\d+)/i);
      const maxBudget = budgetMatch ? parseInt(budgetMatch[1], 10) : null;

      const matched = products.filter((p) => {
        if (maxBudget && p.price > maxBudget) return false;
        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => q.includes(t.toLowerCase()))
        );
      });

      setAiMatchedIds(matched.map((p) => p.id));
      setAiExplanation(
        maxBudget
          ? `Found ${matched.length} items within your budget of Rs. ${maxBudget.toLocaleString()}.`
          : `Found ${matched.length} matching items.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  if (!isSearchOpen) return null;

  // Active results list
  const activeResults = searchMode === 'ai' && aiMatchedIds !== null
    ? products.filter((p) => aiMatchedIds.includes(p.id))
    : standardResults;

  const quickSearches = ['Watches', 'Wallets', 'Skincare', 'Kitchen', 'Kids'];
  const aiNaturalPrompts = [
    'Wallet under Rs. 2000',
    'Skincare product for oily skin',
    'Watch under 4000',
    'Kitchen gadgets for everyday cooking'
  ];

  const handleProductClick = (product: Product) => {
    onSelectProduct(product);
    setIsSearchOpen(false);
  };

  const handleViewAllProducts = () => {
    setActiveTab('products');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden mt-6 sm:mt-10 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mode Selector Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100 text-xs font-semibold">
          <button
            onClick={() => {
              setSearchMode('standard');
              setAiExplanation(null);
            }}
            className={`flex-1 py-2.5 px-4 text-center transition-colors flex items-center justify-center gap-1.5 ${
              searchMode === 'standard'
                ? 'bg-white text-stone-900 border-t-2 border-[#b2883b]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Standard Search</span>
          </button>

          <button
            onClick={() => {
              setSearchMode('ai');
              if (searchQuery.trim()) {
                handleAiSearch();
              }
            }}
            className={`flex-1 py-2.5 px-4 text-center transition-colors flex items-center justify-center gap-1.5 ${
              searchMode === 'ai'
                ? 'bg-white text-[#b2883b] border-t-2 border-[#b2883b]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b2883b]" />
            <span>AI Smart Search (Natural Language)</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3 bg-stone-50">
          {searchMode === 'ai' ? (
            <Sparkles className="w-5 h-5 text-[#b2883b] shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-[#b2883b] shrink-0" />
          )}

          <input
            ref={inputRef}
            type="text"
            placeholder={
              searchMode === 'ai'
                ? "Type a natural request: 'wallet under Rs. 2000' or 'serum for dry skin'..."
                : "Search watches, wallets, serums, gadgets by keyword..."
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (searchMode === 'ai') {
                setAiMatchedIds(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (searchMode === 'ai') {
                  handleAiSearch();
                }
              }
            }}
            className="flex-1 bg-transparent text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-none"
          />

          {searchMode === 'ai' && (
            <button
              onClick={() => handleAiSearch()}
              disabled={aiLoading || !searchQuery.trim()}
              className="px-3 py-1.5 bg-[#18181b] hover:bg-[#b2883b] text-white rounded-md text-xs font-bold transition-colors disabled:opacity-40 flex items-center gap-1 shrink-0"
            >
              {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          )}

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setAiMatchedIds(null);
                setAiExplanation(null);
              }}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200 overflow-x-auto whitespace-nowrap flex items-center gap-1.5 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
            {searchMode === 'ai' ? 'Try Natural Prompts:' : 'Quick Searches:'}
          </span>

          {searchMode === 'ai' ? (
            aiNaturalPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleAiSearch(prompt)}
                className="px-2.5 py-1 bg-white hover:bg-[#fcf9f0] border border-stone-200 hover:border-[#d4af37] text-stone-700 hover:text-stone-900 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer"
              >
                ✨ {prompt}
              </button>
            ))
          ) : (
            quickSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-2.5 py-1 bg-white hover:bg-stone-200 text-stone-700 rounded-full text-[11px] transition-colors shrink-0"
              >
                {term}
              </button>
            ))
          )}
        </div>

        {/* AI Reasoning / Explanation Banner */}
        {searchMode === 'ai' && aiExplanation && (
          <div className="p-3 mx-4 mt-3 bg-[#fcf9f0] border border-[#d4af37]/50 rounded-xl flex items-start gap-2.5 text-xs text-stone-800 animate-in fade-in duration-200">
            <Sparkles className="w-4 h-4 text-[#b2883b] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#8f6927]">Gemini AI Semantic Analysis</p>
              <p className="text-stone-600 mt-0.5">{aiExplanation}</p>
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="p-4 sm:p-5 max-h-[55vh] overflow-y-auto">
          {aiLoading ? (
            <div className="py-12 text-center text-stone-500 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#b2883b]" />
              <p className="text-xs">Analyzing catalog with Gemini AI for "{searchQuery}"...</p>
            </div>
          ) : activeResults.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span>
                  {searchMode === 'ai'
                    ? `Showing ${activeResults.length} AI-matched products`
                    : searchQuery.trim()
                    ? `Results for "${searchQuery}" (${activeResults.length})`
                    : 'Popular & Trending Products'}
                </span>
                <span className="text-[11px] text-[#b2883b] font-semibold">Cash on Delivery Available</span>
              </div>

              {activeResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-400 capitalize mb-0.5">
                      <span>{product.category.replace('-', ' ')}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        {product.rating}
                      </span>
                    </div>

                    <h4 className="font-serif text-sm font-bold text-stone-900 truncate group-hover:text-[#b2883b]">
                      {product.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-stone-900">
                        {formatPKR(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-[10px] text-stone-400 line-through">
                          {formatPKR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-stone-400 group-hover:text-[#b2883b] pr-2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-500 space-y-3">
              <Search className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm font-medium">No products found matching "{searchQuery}"</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Try searching for general terms like "watch", "wallet", "serum", or use the AI Smart Search tab.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Nationwide COD in 120+ Pakistani Cities</span>
          <button
            onClick={handleViewAllProducts}
            className="text-stone-900 font-bold hover:text-[#b2883b] flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
