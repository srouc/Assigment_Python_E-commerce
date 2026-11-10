import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  Star,
} from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { RatingStars } from '../../components/RatingStars';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const COLOR_MAP: Record<string, string> = {
  black: '#0f172a',
  'midnight black': '#0f172a',
  white: '#ffffff',
  ivory: '#fdfbf7',
  cream: '#fef08a',
  navy: '#1e293b',
  'deep navy': '#1e293b',
  silver: '#cbd5e1',
  'platinum silver': '#cbd5e1',
  grey: '#64748b',
  gray: '#64748b',
  camel: '#c19a6b',
  beige: '#d4b996',
  tan: '#d2b48c',
  emerald: '#065f46',
  'olive green': '#556b2f',
  olive: '#556b2f',
  burgundy: '#881337',
  wine: '#881337',
  red: '#dc2626',
  pink: '#f472b6',
  'blush pink': '#fbcfe8',
  rose: '#f43f5e',
  blue: '#2563eb',
  sky: '#0ea5e9',
  indigo: '#4f46e5',
  violet: '#7c3aed',
  purple: '#9333ea',
  amber: '#f59e0b',
  gold: '#d97706',
  brown: '#78350f',
  charcoal: '#334155',
};

const resolveColorHex = (c: any): string => {
  if (!c) return '#475569';
  if (typeof c === 'string') {
    const trimmed = c.trim().toLowerCase();
    if (trimmed.startsWith('#')) return c.trim();
    return COLOR_MAP[trimmed] || '#475569';
  }
  if (typeof c === 'object') {
    const hex = c.hex || c.code || c.value;
    if (hex && typeof hex === 'string') return hex.trim();
    const name = c.name || c.color || c.label;
    if (name && typeof name === 'string') {
      const trimmed = name.trim().toLowerCase();
      return COLOR_MAP[trimmed] || '#475569';
    }
  }
  return '#475569';
};

const resolveColorName = (c: any): string => {
  if (!c) return 'Standard';
  if (typeof c === 'string') return c.trim() || 'Standard';
  if (typeof c === 'object') {
    const name = c.name || c.label || c.color || c.hex;
    if (name && typeof name === 'string') return name.trim() || 'Standard';
  }
  return 'Standard';
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'care' | 'reviews'>('desc');

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductBySlug(id as string);
        setProduct(data);
        setActiveImage(data.display_image);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
          const firstCol = data.colors[0];
          const colName = resolveColorName(firstCol);
          setSelectedColor(colName);
        }
      } catch (err) {
        console.error('Failed fetching product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showToast('Please select a size first', 'error');
      return;
    }
    await addToCart(product.id, quantity, selectedSize, selectedColor);
    showToast(`Added ${quantity}x ${product.name} (${selectedSize} / ${selectedColor}) to bag!`, 'success');
  };

  if (loading || !product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Loading Fashion Lookbook...
          </p>
        </div>
      </MainLayout>
    );
  }

  const allImages = [
    product.display_image,
    ...(product.images?.map((img) => img.display_image) || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <MainLayout title={`${product.name} — ShopEase Fashion`}>
      <div className="bg-slate-50 min-h-screen py-4 sm:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 sm:mb-8">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-indigo-600">Fashion Catalog</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
          </nav>

          {/* Main Product Section: Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 bg-white rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xs">
            
            {/* Left Column: Image Gallery (7 cols) */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-20 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border-2 transition-all ${
                        activeImage === imgUrl
                          ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-center" />
                    </button>
                  ))}
                </div>
              )}

              {/* Primary Active Image Display */}
              <div className="flex-1 relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                {product.discount_percentage > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
                    -{product.discount_percentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Fashion Specifications & Actions (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & Category */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                    {product.brand}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* Star Ratings & Verified Badge */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={Number(product.rating)} size={16} />
                    <span className="text-sm font-bold text-slate-800 font-mono">
                      {Number(product.rating).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">|</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {product.reviews_count} verified reviews
                  </span>
                </div>

                {/* Pricing Box */}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl font-black text-slate-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-lg text-slate-400 line-through">
                      ${Number(product.compare_at_price).toFixed(2)}
                    </span>
                  )}
                  {product.discount_percentage > 0 && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                      Save ${(Number(product.compare_at_price) - Number(product.price)).toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {product.description}
                </p>

                {/* 1. Color Swatch Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">
                        Color: <strong className="text-slate-900">{selectedColor}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {product.colors.map((colorItem, idx) => {
                        const colName = resolveColorName(colorItem);
                        const colHex = resolveColorHex(colorItem);
                        const isSelected = selectedColor === colName;
                        const isLightColor = ['#FDFBF7', '#FDE68A', '#FFFFFF'].includes(String(colHex || '').toUpperCase());
                        return (
                          <button
                            key={colName || idx}
                            type="button"
                            onClick={() => setSelectedColor(colName)}
                            title={colName}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110 shadow-md'
                                : 'hover:scale-105 border border-slate-300'
                            }`}
                            style={{ backgroundColor: colHex }}
                          >
                            {isSelected && (
                              <Check
                                className={`w-4 h-4 ${
                                  isLightColor ? 'text-slate-900' : 'text-white'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Size Picker */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">
                        Size: <strong className="text-slate-900">{selectedSize}</strong>
                      </span>
                      <button className="text-indigo-600 hover:underline font-semibold">
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {product.sizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-400'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stock indicator */}
                <div className="flex items-center gap-2 pt-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-emerald-700">
                    In Stock ({product.stock_quantity} pieces ready to ship)
                  </span>
                </div>

                {/* Quantity Stepper & Add to Bag CTA */}
                <div className="flex gap-4 pt-4">
                  {/* Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 shadow-xs transition-all"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-800 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 shadow-xs transition-all"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add To Bag • ${(Number(product.price) * quantity).toFixed(2)}
                  </button>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>Complimentary Doorstep Express Delivery on orders over $50</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>30-Day Hassle-free Exchange and Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>100% Original Brand Authenticity Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Add-to-Bag Bottom Action Bar */}
        <div className="fixed bottom-12 inset-x-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 shadow-lg flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-slate-500 truncate">{product.name}</span>
            <span className="text-base font-black text-indigo-600 font-mono">
              ${(Number(product.price) * quantity).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Add To Bag
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
