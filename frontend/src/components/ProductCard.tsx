import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye, Heart, Check } from 'lucide-react';
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
  const [isLiked, setIsLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      setJustAdded(true);
      showToast(`Added "${product.name}" to cart!`, 'success');
      setTimeout(() => setJustAdded(false), 2000);
    } catch {
      showToast('Could not add to cart. Check stock.', 'error');
    }
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    showToast(isLiked ? 'Removed from favorites' : 'Saved to favorites!', 'info');
  };

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.discount_percentage > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md tracking-wider uppercase">
            -{product.discount_percentage}% OFF
          </span>
        )}
        {product.is_featured && (
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md tracking-wider uppercase">
            Featured
          </span>
        )}
      </div>

      {/* Top Right Action (Wishlist Heart) */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleToggleLike}
          aria-label="Save to Wishlist"
          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isLiked
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-rose-500 scale-110' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-slate-50 overflow-hidden">
        <Image
          src={product.display_image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            Quick View
          </span>
        </div>
      </Link>

      {/* Information Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Stock Status */}
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold">
            <span className="text-indigo-600 tracking-wider uppercase font-bold text-[10px]">
              {product.category_name || product.brand || 'ShopEase'}
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] ${
              product.is_in_stock ? 'text-emerald-600' : 'text-rose-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.is_in_stock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="mt-2.5">
            <RatingStars rating={product.rating} reviewsCount={product.reviews_count} size={13} />
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              ${Number(product.price).toFixed(2)}
            </div>
            {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
              <span className="text-[11px] text-slate-400 line-through">
                ${Number(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.is_in_stock || loading}
            aria-label="Add to Cart"
            className={`p-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-indigo-600 active:scale-95 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
