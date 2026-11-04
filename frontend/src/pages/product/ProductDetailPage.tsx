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
        const related = await productService.getProducts({
          category: typeof prod.category === 'object' ? prod.category.slug : prod.category_slug,
        });
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
      showToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');
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

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
          <p className="text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
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
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-indigo-600">Shop</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* Gallery Col */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
              <Image
                src={selectedImage || product.display_image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.discount_percentage > 0 && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  -{product.discount_percentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === img ? 'border-indigo-600 shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Col */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {product.brand || product.category_name || 'ShopEase Premium'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <RatingStars rating={product.rating} reviewsCount={product.reviews_count} size={18} />
                  <span className="text-xs text-slate-400">SKU: {product.sku}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-black text-slate-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                  <span className="text-lg text-slate-400 line-through">
                    ${Number(product.compare_at_price).toFixed(2)}
                  </span>
                )}
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  product.is_in_stock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {product.is_in_stock ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-sm text-slate-600 leading-relaxed pt-2">
                {product.short_description || product.description}
              </p>

              {/* Quantity & Add to Cart */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-semibold text-slate-700">Quantity:</label>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-slate-200 rounded-l-xl transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="p-2 hover:bg-slate-200 rounded-r-xl transition-colors"
                      disabled={quantity >= product.stock_quantity}
                    >
                      <Plus className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.is_in_stock || cartLoading}
                    className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add To Cart (${(Number(product.price) * quantity).toFixed(2)})
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100 text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <Truck className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-700 block">Fast Delivery</span>
                  <span className="text-[10px] text-slate-400">Within 24-48 hrs</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-700 block">Original & Safe</span>
                  <span className="text-[10px] text-slate-400">100% Genuine</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <RotateCcw className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-700 block">Easy Returns</span>
                  <span className="text-[10px] text-slate-400">30-day window</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Description & Specs */}
        <div className="mt-12 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Detailed Product Overview</h2>
          <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Customer Reviews ({reviews.length})</h2>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars rating={product.rating} size={18} />
                <span className="text-sm font-semibold text-slate-700">Average: {Number(product.rating).toFixed(1)} out of 5</span>
              </div>
            </div>
          </div>

          {/* Write a Review Form */}
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-indigo-600" />
              Write a Review
            </h3>

            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-600">Your Rating:</span>
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
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <textarea
              placeholder="Share your thoughts about this product's quality, features, or experience..."
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No reviews yet for this product. Be the first to review!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                        {rev.reviewer_name[0] || 'C'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{rev.reviewer_name}</span>
                          {rev.is_verified_purchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                            </span>
                          )}
                        </div>
                        <RatingStars rating={rev.rating} size={12} showScore={false} />
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rev.title && <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>}
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">You May Also Like</h2>
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

