import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Plus,
  Minus,
  CheckCircle2,
  ArrowLeft,
  MessageSquarePlus,
  Heart,
  Share2,
  Sparkles,
} from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { RatingStars } from '../../components/RatingStars';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Product, Review } from '../../types';

export const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const { id: slugOrId } = router.query;

  const { addToCart, loading: cartLoading } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [isFavorited, setIsFavorited] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState(user?.name || '');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slugOrId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const prod = await productService.getProductBySlug(slugOrId as string);
        setProduct(prod);
        setSelectedImage(prod.display_image);

        // Fetch reviews
        const revs = await reviewService.getReviews(prod.slug);
        setReviews(revs);

        // Fetch related products
        const catSlug = typeof prod.category === 'object' ? prod.category.slug : prod.category_slug;
        const related = await productService.getProducts({ category: catSlug });
        setRelatedProducts(related.filter((p) => p.id !== prod.id).slice(0, 4));
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slugOrId]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity);
      showToast(`Added ${quantity}x "${product.name}" to your cart!`, 'success');
    } catch {
      showToast('Could not add to cart. Please check stock.', 'error');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const newRev = await reviewService.createReview(product.slug, {
        rating: reviewRating,
        comment: reviewComment,
        reviewer_name: reviewName.trim() || undefined,
      });
      setReviews([newRev, ...reviews]);
      setReviewComment('');
      showToast('Review submitted successfully! Thank you.', 'success');
    } catch {
      showToast('Failed to post review. Please try again.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col justify-center items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="text-xs text-slate-400 font-medium">Loading product specifications...</span>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">The product you are looking for does not exist or has been removed.</p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20">
            <ArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </MainLayout>
    );
  }

  const allImages = [
    product.display_image,
    ...(product.images?.map((img) => img.display_image) || []),
  ].filter(Boolean);

  return (
    <MainLayout
      title={`${product.name} | ShopEase`}
      description={product.short_description || product.description.slice(0, 150)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-indigo-600 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
              <Image
                src={selectedImage || product.display_image}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500"
                priority
              />
              {product.discount_percentage > 0 && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg tracking-wider uppercase">
                  -{product.discount_percentage}% OFF
                </span>
              )}

              {/* Share & Like Float Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-indigo-600 shadow-md transition-all hover:scale-105"
                  title="Share product link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsFavorited(!isFavorited);
                    showToast(isFavorited ? 'Removed from favorites' : 'Saved to favorites!', 'info');
                  }}
                  className={`p-2.5 rounded-full backdrop-blur-md shadow-md transition-all hover:scale-105 ${
                    isFavorited ? 'bg-rose-50 text-rose-500' : 'bg-white/90 text-slate-600 hover:text-rose-500'
                  }`}
                  title="Favorite"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 pt-1 custom-scrollbar">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === img
                        ? 'border-indigo-600 shadow-md scale-95 ring-2 ring-indigo-100'
                        : 'border-slate-200/80 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  {product.brand || product.category_name || 'Premium Brand'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 leading-snug">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mt-2.5">
                  <RatingStars rating={product.rating} reviewsCount={product.reviews_count} size={16} />
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-mono text-slate-400">SKU: {product.sku}</span>
                </div>
              </div>

              {/* Price & Stock Badge */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                  <span className="text-lg text-slate-400 line-through">
                    ${Number(product.compare_at_price).toFixed(2)}
                  </span>
                )}
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  product.is_in_stock
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {product.is_in_stock ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {product.short_description || product.description}
              </p>

              {/* Quantity Controls & Add to Cart */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-0.5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-white rounded-xl transition-all"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <span className="w-12 text-center text-xs font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="p-2 hover:bg-white rounded-xl transition-all"
                      disabled={quantity >= product.stock_quantity}
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.is_in_stock || cartLoading}
                    className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add To Cart &bull; ${(Number(product.price) * quantity).toFixed(2)}
                  </button>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-3 gap-2.5 pt-6 border-t border-slate-100 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Truck className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 block">Fast Courier</span>
                  <span className="text-[10px] text-slate-400">Within 24-48 hrs</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 block">Original Verified</span>
                  <span className="text-[10px] text-slate-400">100% Genuine</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <RotateCcw className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 block">30-Day Returns</span>
                  <span className="text-[10px] text-slate-400">Money-back</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Overview & Reviews Section */}
        <div className="mt-12 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex gap-4 border-b border-slate-100 pb-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-sm font-bold pb-2 transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Full Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-bold pb-2 transition-colors relative ${
                activeTab === 'reviews'
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'overview' ? (
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-4">
              <p>{product.description}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Write Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquarePlus className="w-4 h-4 text-indigo-600" />
                  Write Customer Feedback
                </h3>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <textarea
                  placeholder="Share details of your experience, performance, and product build quality..."
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No customer reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                            {rev.reviewer_name[0] || 'C'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{rev.reviewer_name}</span>
                              {rev.is_verified_purchase && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Verified
                                </span>
                              )}
                            </div>
                            <RatingStars rating={rev.rating} size={12} showScore={false} />
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
