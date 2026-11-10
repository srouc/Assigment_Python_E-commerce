import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Check,
  Tag,
  Zap,
} from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { ProductCard } from '../../components/ProductCard';
import { LightningDeals } from '../../components/LightningDeals';
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
        console.error('Failed loading homepage fashion data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Welcome to ShopEase! Use voucher WELCOME10 for $10 off your order.', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <MainLayout>
      {/* 1. Hero Fashion Lookbook Banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-semibold text-indigo-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Spring / Summer 2026 Live
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Effortless Elegance.{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                  Modern Tailoring.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover curated contemporary fashion, Italian virgin wool blazers, Japanese selvedge denim, mulberry silk dresses, and artisanal footwear designed for life.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/shop?category=outerwear"
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-sm backdrop-blur-md flex items-center justify-center gap-2 transition-all"
                >
                  <Tag className="w-4 h-4 text-amber-400" />
                  Outerwear &amp; Coats
                </Link>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-4 sm:pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                  <div className="text-[10px] sm:text-xs text-slate-400">Authentic Fabric</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">48h</div>
                  <div className="text-[10px] sm:text-xs text-slate-400">Express Delivery</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">30-Day</div>
                  <div className="text-[10px] sm:text-xs text-slate-400">Free Exchange</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <img
                  src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop"
                  alt="Featured Trench Coat Look"
                  className="w-full h-80 sm:h-[450px] lg:h-[520px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Glass Pill */}
                <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 bg-slate-900/85 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 shadow-lg text-white flex items-center justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      FEATURED LOOK
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold truncate max-w-[170px] sm:max-w-none">Double-Breasted Trench</h3>
                    <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">$189.00 USD</p>
                  </div>
                  <Link
                    href="/product/oversized-double-breasted-trench-coat"
                    className="p-2.5 sm:p-3 rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-500 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Value Proposition Strip */}
      <section className="bg-white border-y border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Free Express Delivery</h4>
                <p className="text-[11px] text-slate-500">On all orders above $50</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">ABA KHQR &amp; COD</h4>
                <p className="text-[11px] text-slate-500">100% encrypted &amp; verified</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">30-Day Easy Returns</h4>
                <p className="text-[11px] text-slate-500">Hassle-free size exchange</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">24/7 Client Care</h4>
                <p className="text-[11px] text-slate-500">Dedicated styling assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 ⚡ Lightning Deals / Flash Sale Section */}
      <LightningDeals products={featuredProducts} />

      {/* 3. Shop by Category Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Shop By Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
            >
              Browse All Categories
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-sm border border-slate-200"
              >
                <img
                  src={cat.display_image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 inset-x-4 text-white">
                  <h3 className="text-xs sm:text-sm font-bold">{cat.name}</h3>
                  <span className="text-[10px] text-indigo-300 font-medium">Explore &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trending Fashion Pieces Grid */}
      <section className="py-10 sm:py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-3">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Trending Now
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Curated Fashion Essentials
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
            >
              View Complete Catalog
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Newsletter */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Join the ShopEase Fashion Circle
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Receive exclusive seasonal previews, private sale invitations, and get an instant $10 welcome voucher applied to your first order.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 backdrop-blur-md"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};
export default HomePage;
