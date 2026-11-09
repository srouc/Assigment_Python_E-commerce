import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import {
  CreditCard,
  Truck,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { couponService } from '../../services/couponService';
import { authService } from '../../services/authService';

export const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { coupon: queryCoupon } = router.query;
  const { cart, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [shippingName, setShippingName] = useState(user?.full_name || '');
  const [shippingPhone, setShippingPhone] = useState(user?.phone_number || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('Phnom Penh');
  const [shippingState, setShippingState] = useState('Phnom Penh');
  const [shippingPostalCode, setShippingPostalCode] = useState('12000');
  const [shippingCountry, setShippingCountry] = useState('Cambodia');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'aba_khqr' | 'paypal'>('cod');
  const [couponCode, setCouponCode] = useState<string>((queryCoupon as string) || '');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  // Auto-fill addresses if user has saved addresses
  useEffect(() => {
    if (isAuthenticated) {
      authService.getAddresses().then((addrs) => {
        if (addrs.length > 0) {
          const def = addrs.find((a) => a.is_default) || addrs[0];
          setShippingName(def.full_name);
          setShippingPhone(def.phone_number);
          setShippingAddress(def.street_address);
          setShippingCity(def.city);
          setShippingState(def.state || '');
          setShippingPostalCode(def.postal_code || '');
          setShippingCountry(def.country);
        }
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);

  // Validate coupon if passed
  useEffect(() => {
    if (couponCode && subtotal > 0) {
      couponService.validateCoupon(couponCode, subtotal)
        .then((res) => {
          setCouponDiscount(Number(res.coupon.discount_amount));
        })
        .catch(() => {
          setCouponDiscount(0);
        });
    }
  }, [couponCode, subtotal]);

  const shippingFee = subtotal >= 50 || subtotal === 0 ? 0 : 5.0;
  const total = Math.max(0, subtotal - couponDiscount + shippingFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    if (!shippingName || !shippingPhone || !shippingAddress || !shippingCity) {
      showToast('Please fill in all required shipping address fields.', 'error');
      return;
    }

    setPlacingOrder(true);
    try {
      const order = await orderService.createOrder({
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_postal_code: shippingPostalCode,
        shipping_country: shippingCountry,
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined,
        guest_email: guestEmail || undefined,
        notes: notes || undefined,
      });

      setOrderComplete(order);
      await refreshCart();
      showToast(`Order ${order.order_number} placed successfully!`, 'success');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to place order. Please check stock.';
      showToast(msg, 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderComplete) {
    return (
      <MainLayout title="Order Confirmed! | ShopEase">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Order Reference: <strong className="text-indigo-600 font-mono text-base">{orderComplete.order_number}</strong>
          </p>

          <div className="mt-8 bg-white border border-slate-200/80 rounded-3xl p-6 text-left shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-sm">
              <span className="text-slate-500">Payment Method</span>
              <span className="font-semibold text-slate-800 uppercase">{orderComplete.payment_method_display}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-sm">
              <span className="text-slate-500">Payment Status</span>
              <span className="font-semibold text-emerald-600 uppercase">{orderComplete.payment_status_display}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-sm">
              <span className="text-slate-500">Shipping Address</span>
              <span className="font-medium text-slate-800 text-right">
                {orderComplete.shipping_name}, {orderComplete.shipping_address}, {orderComplete.shipping_city}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 text-base font-black text-slate-900">
              <span>Total Paid/Due</span>
              <span className="text-indigo-600">${Number(orderComplete.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Track Order Status
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-2xl border border-slate-300 font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Checkout | ShopEase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Shipping Details */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="+855 12 345 678"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address (for order receipts)</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House / Building No, Street Name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={shippingPostalCode}
                    onChange={(e) => setShippingPostalCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Country</label>
                  <input
                    type="text"
                    value={shippingCountry}
                    onChange={(e) => setShippingCountry(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Delivery Notes (optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave package with security guard..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Select Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-indigo-600"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Cash On Delivery (COD)</span>
                    <span className="text-xs text-slate-500">Pay in cash upon doorstep arrival.</span>
                  </div>
                </label>

                {/* ABA KHQR Mobile Banking */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'aba_khqr'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="aba_khqr"
                    checked={paymentMethod === 'aba_khqr'}
                    onChange={() => setPaymentMethod('aba_khqr')}
                    className="mt-1 text-indigo-600"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      ABA KHQR / Mobile
                    </span>
                    <span className="text-xs text-slate-500">Instant scan with any mobile banking app.</span>
                  </div>
                </label>

                {/* Card */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-indigo-600"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Credit / Debit Card</span>
                    <span className="text-xs text-slate-500">Visa, Mastercard, UnionPay.</span>
                  </div>
                </label>

                {/* PayPal */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mt-1 text-indigo-600"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">PayPal</span>
                    <span className="text-xs text-slate-500">Pay safely with your PayPal account.</span>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Order Summary Col */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Review Items ({items.length})</h2>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={item.product.display_image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">{item.product.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Qty: {item.quantity}</span>
                      {item.selected_size && <span>• Size: {item.selected_size}</span>}
                      {item.selected_color && <span>• {item.selected_color}</span>}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    ${Number(item.total_price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-lg font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-2xl text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder || items.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
            >
              {placingOrder ? 'Processing Order...' : `Place Order ($${total.toFixed(2)})`}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Money-back guarantee & secure data encryption</span>
            </div>
          </div>

        </form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;

