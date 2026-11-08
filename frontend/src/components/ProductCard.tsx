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

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0]?.name || 'Standard';
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
            {product.colors?.slice(0, 4).map((c, idx) => (
              <span
                key={idx}
                title={c.name}
                className="w-3 h-3 rounded-full border border-slate-300 shadow-xs"
                style={{ backgroundColor: c.hex }}
              />
            ))}
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
