import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { RatingStars } from './RatingStars';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, loading } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      showToast(`Added "${product.name}" to your cart!`, 'success');
    } catch {
      showToast('Could not add to cart. Check stock.', 'error');
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.discount_percentage > 0 && (
          <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            -{product.discount_percentage}% OFF
          </span>
        )}
        {product.is_featured && (
          <span className="bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-slate-100 overflow-hidden">
        <Image
          src={product.display_image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full shadow hover:scale-110 transition-transform">
            <Eye className="w-5 h-5" />
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-indigo-600">{product.category_name || product.brand || 'ShopEase'}</span>
            <span>{product.is_in_stock ? 'In Stock' : 'Out of Stock'}</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-2">
            <RatingStars rating={product.rating} reviewsCount={product.reviews_count} size={14} />
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </div>
            {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
              <span className="text-xs text-slate-400 line-through">
                ${Number(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.is_in_stock || loading}
            aria-label="Add to Cart"
            className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

