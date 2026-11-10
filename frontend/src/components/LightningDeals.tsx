import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Clock,
  ArrowRight,
  Flame,
  ShoppingBag,
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface LightningDealsProps {
  products: Product[];
}

export const LightningDeals: React.FC<LightningDealsProps> = ({ products }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Countdown timer initialized to 8 hours, 42 minutes, 19 seconds
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter or take products with highest discounts
  const dealProducts = products
    .filter((p) => p.discount_percentage && p.discount_percentage > 0)
    .slice(0, 4);

  const displayProducts = dealProducts.length > 0 ? dealProducts : products.slice(0, 4);

  const handleQuickAdd = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes?.[0] || 'M';
    const color = (typeof product.colors?.[0] === 'string' ? product.colors[0] : (product.colors?.[0] as any)?.name) || 'Standard';
    await addToCart(product.id, 1, size, color);
    showToast(`⚡ Added ${product.name} (Lightning Deal) to bag!`, 'success');
  };

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-b from-amber-500/5 via-slate-50 to-white border-y border-amber-500/20 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Lightning Deals Header Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 p-5 sm:p-6 rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-950/10 border border-slate-800">
          
          {/* Left: Badge & Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0 animate-pulse">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                  ⚡ Flash Sale Live
                </span>
                <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                  Up to 40% OFF Exclusive Drops
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5 flex items-center gap-2">
                Lightning Deals <span className="text-xs text-amber-400 font-normal">ការបញ្ចុះតម្លៃរហ័ស</span>
              </h2>
            </div>
          </div>

          {/* Right: Real-time Countdown Timer */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-300">Ends in:</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-black text-sm sm:text-base min-w-[36px] text-center shadow-inner">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-[9px] text-slate-500 font-bold mt-1">HRS</span>
              </div>
              <span className="text-slate-600 font-bold text-sm mb-3">:</span>

              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-black text-sm sm:text-base min-w-[36px] text-center shadow-inner">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-[9px] text-slate-500 font-bold mt-1">MIN</span>
              </div>
              <span className="text-slate-600 font-bold text-sm mb-3">:</span>

              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-black text-sm sm:text-base min-w-[36px] text-center shadow-inner">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span className="text-[9px] text-slate-500 font-bold mt-1">SEC</span>
              </div>
            </div>

            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10"
            >
              See All Deals
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* 4 Lightning Deals Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayProducts.map((p, idx) => {
            const discountPct = p.discount_percentage || (idx === 0 ? 35 : idx === 1 ? 28 : idx === 2 ? 40 : 25);
            const originalPrice = p.compare_at_price ? Number(p.compare_at_price) : Number(p.price) / (1 - discountPct / 100);
            const claimPct = 65 + (idx * 8); // e.g. 65%, 73%, 81%, 89%

            return (
              <div
                key={p.id}
                className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-200/80 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Deal Image Frame */}
                <Link href={`/product/${p.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 block">
                  <img
                    src={p.display_image}
                    alt={p.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                    }}
                  />

                  {/* Top Flash Discount Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[10px] sm:text-xs font-black shadow-md tracking-wider">
                    <Zap className="w-3 h-3 fill-white" />
                    -{discountPct}% OFF
                  </div>

                  {/* Top Right: Stock Fire Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-white/10">
                    <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
                    Hot
                  </div>
                </Link>

                {/* Details Content */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block mb-0.5">
                      {p.brand || 'ShopEase'}
                    </span>
                    <Link href={`/product/${p.slug}`}>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {p.name}
                      </h3>
                    </Link>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-sm sm:text-base font-black text-rose-600">
                        ${Number(p.price).toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Limited Stock Progress Bar */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <strong className="text-slate-800">{claimPct}%</strong> Claimed
                      </span>
                      <span className="text-rose-600 font-bold text-[10px]">
                        Only {Math.max(2, 20 - idx * 4)} Left
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-1000"
                        style={{ width: `${claimPct}%` }}
                      />
                    </div>
                  </div>

                  {/* 1-Click Grab Deal Action */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, p)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 group/btn"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 group-hover/btn:scale-110 transition-transform" />
                    Grab Deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View All button */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-slate-950 text-white text-xs font-bold shadow-lg"
          >
            See All Lightning Deals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
