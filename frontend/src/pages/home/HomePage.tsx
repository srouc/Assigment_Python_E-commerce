import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Tag, ShieldCheck, Flame } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { Product, Category } from '../../types';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Next-Gen E-Commerce Experience
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Curated Products for <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">Everyday Excellence</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover modern premium gadgets, fashionable apparel, home essentials, and wellness products with guaranteed authenticity and lightning fast shipping.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  Use Code: <span className="text-emerald-400 font-bold">WELCOME10</span> for 10% off
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Sony WH-1000XM5"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Top Seller</span>
                  <h3 className="text-xl font-bold text-white">Sony WH-1000XM5 Noise Cancelling</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-black text-white">$299.00</span>
                    <Link
                      href="/shop"
                      className="px-4 py-1.5 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-slate-950 text-xs font-bold transition-all"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Shop By Category</h2>
            <p className="text-sm text-slate-500 mt-1">Browse our hand-picked selections</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 border border-slate-200/60 shadow-sm hover:shadow-md transition-all"
            >
              <Image
                src={cat.display_image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="text-sm font-bold tracking-tight">{cat.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{cat.products_count} Items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Flame className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Products</h2>
              <p className="text-sm text-slate-500">Trending recommendations selected just for you</p>
            </div>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="bg-slate-200 aspect-square rounded-xl" />
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

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              Special Discount Offer
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Get $15 Off On Orders Over $60
            </h3>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Use code <strong className="font-mono bg-white text-indigo-900 px-2.5 py-0.5 rounded-lg">SAVE15</strong> during checkout to claim your instant savings.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-xl text-sm hover:bg-slate-100 transition-colors shadow-lg"
              >
                Claim Coupon Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;

