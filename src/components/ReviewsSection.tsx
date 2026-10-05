import React, { useState } from 'react';
import { Star, ShieldCheck, MessageSquarePlus, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PAKISTANI_CITIES, PRODUCTS } from '../data/products';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // New review form state
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState(PAKISTANI_CITIES[0]);
  const [rating, setRating] = useState(5);
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    addReview({
      productId: selectedProductId,
      author: author.trim(),
      city: city,
      rating: rating,
      comment: comment.trim(),
    });

    setAuthor('');
    setComment('');
    setIsFormOpen(false);
  };

  return (
    <section className="py-16 bg-[#fafaf9] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#b2883b] mb-1">
              <span>Customer Satisfaction</span>
              <span aria-hidden="true">·</span>
              <span>Verified Pakistani Buyers</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Real Experiences, Real Trust
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="text-stone-900 font-bold text-lg ml-1">4.9 / 5.0</span>
            </div>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-md text-xs font-semibold hover:bg-[#b2883b] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Rating & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-sm text-stone-700 leading-relaxed mb-4 italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & City verification */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{rev.author}</h4>
                  <span className="text-[11px] text-stone-500">{rev.city}</span>
                </div>
                {rev.verified && (
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Buyer</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write a review */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Write a Verified Review</h3>
                  <p className="text-xs text-stone-500">Share your experience with Zee Trends Store</p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Select Product
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Malik"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      City in Pakistan *
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
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-amber-400 fill-current'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-stone-500 ml-2 font-medium">
                      {rating} out of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Review Details *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about the product quality, delivery speed, packaging, etc."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#b2883b]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#18181b] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#b2883b] transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
