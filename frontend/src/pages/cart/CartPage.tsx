import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Tag, CheckCircle2, ShieldCheck } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { couponService } from '../../services/couponService';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await couponService.validateCoupon(couponCode.trim(), subtotal);
      setAppliedCoupon(res.coupon);
      showToast(res.message, 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Invalid coupon code';
      showToast(errorMsg, 'error');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const discountAmount = appliedCoupon ? Number(appliedCoupon.discount_amount) : 0;
  const shippingFee = subtotal >= 50 || subtotal === 0 ? 0 : 5.0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <MainLayout title="Your Cart | ShopEase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">
          Shopping Cart ({cart?.total_items || 0} items)
        </h1>

        {items.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Your shopping cart is empty</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
              Looks like you haven&apos;t added any products yet. Browse through our catalog to find exciting offers!
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
            >
              Start Exploring Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items Table Col */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Products</span>
                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={item.product.display_image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-sm font-bold text-slate-800 hover:text-indigo-600 line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ${Number(item.product.price).toFixed(2)} each
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-slate-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={loading}
                            className="p-1 hover:bg-slate-100 rounded-l"
                          >
                            <Minus className="w-3 h-3 text-slate-600" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="p-1 hover:bg-slate-100 rounded-r"
                          >
                            <Plus className="w-3 h-3 text-slate-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={loading}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900">
                        ${Number(item.total_price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Col */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono outline-none focus:border-indigo-500"
                    />
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 p-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Applied: <strong>{appliedCoupon.code}</strong> (-${discountAmount.toFixed(2)})</span>
                  </div>
                )}
              </form>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-xl text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <Link
                href={{
                  pathname: '/checkout',
                  query: appliedCoupon ? { coupon: appliedCoupon.code } : {},
                }}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all text-center"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted 256-bit SSL Checkout</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;

