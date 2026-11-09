import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Check, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { MOCK_COUPONS } from '../data/fashionMockData';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState('FASHION15');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const subtotal = Number(cart?.subtotal || 0);
  const freeShippingThreshold = 50.0;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
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
      showToast(`Minimum order amount of $${coupon.min_spend} required for this coupon.`, 'error');
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
    showToast(`Voucher ${code} applied! -$${discount.toFixed(2)}`, 'success');
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop blur */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen sm:max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Shopping Bag</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {cart?.total_items || 0}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="px-6 py-3 bg-indigo-50/60 border-b border-indigo-100 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-slate-600 font-medium">
                Add <strong className="text-indigo-700 font-bold">${remainingForFreeShipping.toFixed(2)}</strong> more for <span className="text-emerald-700 font-bold">FREE Express Delivery</span>!
              </p>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Free Express Delivery Unlocked!
              </p>
            )}
            <div className="w-full h-1.5 bg-indigo-200/50 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
            {!cart?.items || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Explore our curated fashion collection and find timeless wardrobe staples.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.product.display_image}
                    alt={item.product.name}
                    className="w-18 h-22 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    
                    {/* Size and Color Details */}
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      {item.selected_size && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          Size: {item.selected_size}
                        </span>
                      )}
                      {item.selected_color && (
                        <span className="text-slate-500 font-medium">
                          Color: {item.selected_color}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold text-indigo-600 mt-1">
                      ${Number(item.product.price).toFixed(2)}
                    </p>

                    {/* Stepper & Delete */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Coupon & Checkout */}
          {cart && cart.items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Voucher code (FASHION15)"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase outline-none focus:border-indigo-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedCode && (
                <div className="flex items-center justify-between text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
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

              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-${appliedDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-bold text-emerald-600">
                    {subtotal >= 50 ? 'FREE' : '$5.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total:</span>
                  <span className="text-indigo-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center transition-colors"
                >
                  View Full Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
