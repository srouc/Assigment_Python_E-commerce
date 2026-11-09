import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { RatingStars } from './RatingStars';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

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
    if (c.hex && typeof c.hex === 'string') return c.hex;
    if (c.name && typeof c.name === 'string') {
      const trimmed = c.name.trim().toLowerCase();
      return COLOR_MAP[trimmed] || '#475569';
    }
  }
  return '#475569';
};

const resolveColorName = (c: any): string => {
  if (!c) return 'Standard';
  if (typeof c === 'string') return c;
  if (typeof c === 'object' && c.name) return String(c.name);
  return 'Standard';
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'M';
    const firstCol = product.colors?.[0];
    const defaultColor = resolveColorName(firstCol);
    await addToCart(product.id, 1, defaultSize, defaultColor);
    showToast(`Added ${product.name} (${defaultSize} / ${defaultColor}) to bag!`, 'success');
  };

  const formattedPrice = Number(product.price).toFixed(2);
  const formattedComparePrice = product.compare_at_price
    ? Number(product.compare_at_price).toFixed(2)
    : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-indigo-400 hover:shadow-xl transition-all duration-300">
      {/* Product Image Frame */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img
          src={product.display_image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discount_percentage > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              -{product.discount_percentage}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-amber-300 text-[10px] font-bold tracking-wider">
              FEATURED LOOK
            </span>
          )}
        </div>

        {/* Hover Quick Action Pill */}
        <button
          onClick={handleQuickAdd}
          aria-label="Quick Add to Bag"
          className="absolute bottom-3 right-3 p-3 rounded-2xl bg-white text-slate-900 shadow-lg hover:bg-indigo-600 hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-200 z-10"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </Link>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>{product.brand}</span>
            <span className="text-indigo-600">{product.category_name}</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="group-hover:text-indigo-600 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {product.short_description}
          </p>
        </div>

        {/* Available Sizes & Colors Preview */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
          {/* Color Dots */}
          <div className="flex items-center gap-1.5">
            {product.colors?.slice(0, 4).map((c, idx) => {
              const colName = resolveColorName(c);
              const colHex = resolveColorHex(c);
              return (
                <span
                  key={idx}
                  title={colName}
                  className="w-3 h-3 rounded-full border border-slate-300 shadow-xs"
                  style={{ backgroundColor: colHex }}
                />
              );
            })}
            {(product.colors?.length || 0) > 4 && (
              <span className="text-[10px] text-slate-400 font-bold">
                +{product.colors!.length - 4}
              </span>
            )}
          </div>

          {/* Sizes Tag */}
          <div className="text-[10px] text-slate-500 font-medium">
            Sizes: <span className="font-bold text-slate-700">{product.sizes?.slice(0, 3).join(', ')}{product.sizes && product.sizes.length > 3 ? '...' : ''}</span>
          </div>
        </div>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={Number(product.rating)} size={12} />
            <span className="text-[11px] font-bold text-slate-600">
              {Number(product.rating).toFixed(1)}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            {formattedComparePrice && (
              <span className="text-xs text-slate-400 line-through">
                ${formattedComparePrice}
              </span>
            )}
            <span className="text-base font-black text-slate-900">
              ${formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
