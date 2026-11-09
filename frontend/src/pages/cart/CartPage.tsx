import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, Check, Tag, ShieldCheck } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_COUPONS } from '../../data/fashionMockData';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState('FASHION15');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const subtotal = Number(cart?.subtotal || 0);
  const freeShippingThreshold = 50.0;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    const coupon = MOCK_COUPONS[code];

    if (!coupon) {
      showToast('Invalid coupon code. Try FASHION15 or WELCOME10', 'error');
      return;
    }

    if (subtotal < Number(coupon.min_spend)) {
      showToast(`Minimum spend of $${coupon.min_spend} required for code ${code}`, 'error');
      return;
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * Number(coupon.discount_value)) / 100;
    } else {
      discount = Number(coupon.discount_value);
    }

    setAppliedDiscount(discount);
    setAppliedCode(code);
    showToast(`Voucher ${code} applied! Saved $${discount.toFixed(2)}`, 'success');
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  return (
    <MainLayout title="Shopping Bag — ShopEase Fashion">
      <div className="bg-slate-50 min-h-screen py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shopping Bag</h1>
            <p className="text-xs text-slate-500 mt-1">Review your curated garments and accessories before checkout.</p>
          </div>

          {!cart?.items || cart.items.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Your bag is currently empty</h2>
              <p className="text-xs text-slate-400">
                Continue browsing our catalog to discover the latest tailored essentials.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/25 hover:bg-indigo-500 transition-all"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Cart Items List (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
                {/* Free Delivery Bar */}
                <div className="pb-4 text-xs font-semibold">
                  {remainingForFreeShipping > 0 ? (
                    <span className="text-slate-600">
                      Add <strong className="text-indigo-600 font-bold">${remainingForFreeShipping.toFixed(2)}</strong> more to get <span className="text-emerald-600 font-bold">FREE Express Delivery</span>!
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Congratulations! Free Delivery is unlocked on your order.
                    </span>
                  )}
                </div>

                {cart.items.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.display_image}
                        alt={item.product.name}
                        className="w-20 h-26 object-cover rounded-2xl bg-slate-100"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                          {item.product.brand}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          {item.selected_size && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                              Size: {item.selected_size}
                            </span>
                          )}
                          {item.selected_color && (
                            <span>Color: {item.selected_color}</span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-indigo-600 mt-2">
                          ${Number(item.product.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="text-sm font-black text-slate-900 w-20 text-right">
                        ${Number(item.total_price).toFixed(2)}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-2 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Order Summary (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <h2 className="text-lg font-black text-slate-900">Order Summary</h2>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Promo Voucher</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. FASHION15"
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase outline-none focus:border-indigo-500"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCode && (
                    <div className="text-xs text-emerald-700 font-bold flex justify-between items-center bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <span>✓ {appliedCode} (-${appliedDiscount.toFixed(2)})</span>
                      <button
                        onClick={() => {
                          setAppliedCode(null);
                          setAppliedDiscount(0);
                        }}
                        className="text-emerald-800 underline text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Calculation Details */}
                <div className="space-y-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount:</span>
                      <span>-${appliedDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Shipping:</span>
                    <span className="font-bold text-emerald-600">
                      {subtotal >= 50 ? 'FREE' : '$5.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                    <span>Estimated Total:</span>
                    <span className="text-indigo-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted &amp; Protected Checkout</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
export default CartPage;
