import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Flame,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Mail,
  Zap,
} from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { Product, Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          productService.getProducts({ featured: true }),
          productService.getCategories(),
        ]);
        setFeaturedProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing! Your $10 voucher code is: WELCOME10', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <MainLayout>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Ambient Gradient Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                New Arrival 2026 Collection Live Now
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]">
                Crafted for Quality.{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                  Designed for Life.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover world-class electronics, trending apparel, artisanal home goods, and health essentials with guaranteed original authenticity and ultra-fast doorstep delivery.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Explore Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/shop?category=electronics"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-sm backdrop-blur-md flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Top Tech Deals
                </Link>
              </div>

              {/* Trust Badges under buttons */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>30-Day Free Return</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Safe Pay</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Hero Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/15 group">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Sony WH-1000XM5"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/20 px-2.5 py-1 rounded-full w-max">
                    Featured Choice
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">
                    Sony WH-1000XM5 Noise Cancelling
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    Industry-leading noise cancelation with two dedicated processors.
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <div>
                      <span className="text-2xl font-black text-white">$299.00</span>
                      <span className="text-xs text-slate-400 line-through ml-2">$399.00</span>
                    </div>
                    <Link
                      href="/product/sony-wh-1000xm5-wireless-headphones"
                      className="px-4 py-2 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 shadow-md transition-all"
                    >
                      View Specs
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Value Proposition Strip */}
      <section className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Free Express Delivery</h4>
                <p className="text-[11px] text-slate-500">On all orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Secure Payments</h4>
                <p className="text-[11px] text-slate-500">256-bit encrypted checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">30-Day Free Returns</h4>
                <p className="text-[11px] text-slate-500">Money back guaranteed</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">24/7 Dedicated Support</h4>
                <p className="text-[11px] text-slate-500">Always here to help you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Departments</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            All Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-100 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Image
                src={cat.display_image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                <h3 className="text-sm font-bold tracking-tight group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-slate-300 mt-0.5">
                  {cat.products_count} Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured & Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-2xl">
              <Flame className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Trending Now</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                Featured Selection
              </h2>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            Explore Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-3xl border border-slate-200 space-y-4">
                <div className="bg-slate-200 aspect-square rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Promotional Discount Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
              Exclusive Promo Offer
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Get $15 Off When You Spend $60 Or More
            </h3>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Apply code <strong className="font-mono bg-white text-indigo-900 px-3 py-1 rounded-xl shadow-sm text-sm">SAVE15</strong> during checkout to claim your instant storewide discount.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-950 font-bold rounded-2xl text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-95"
              >
                Claim Coupon Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Newsletter Subscription */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 text-center max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Join the ShopEase VIP Club</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Subscribe to receive insider-only product drops, flash sale alerts, and an instant $10 welcome coupon code.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all whitespace-nowrap active:scale-95"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
