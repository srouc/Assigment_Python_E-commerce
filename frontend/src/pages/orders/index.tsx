import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle2, Truck, XCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return (
    <MainLayout title="My Orders | ShopEase">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6 sm:mb-8">
          Order History & Tracking
        </h1>

        {!isAuthenticated && orders.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-sm">
            <Package className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Sign in to view your orders</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You need to sign in to access your complete purchase history and delivery tracking.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-700">No orders placed yet</h2>
            <p className="text-xs text-slate-400 mt-1">
              Start shopping our store and your orders will show up here.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400">Order Number</span>
                    <h3 className="text-base font-black text-indigo-600 font-mono">
                      {ord.order_number}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      ord.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : ord.status === 'shipped'
                        ? 'bg-sky-50 text-sky-700'
                        : ord.status === 'processing'
                        ? 'bg-indigo-50 text-indigo-700'
                        : ord.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {ord.status_display || ord.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {ord.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{item.product_name}</span>
                        <span className="text-slate-400">x{item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900">${Number(item.total_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
                  <div className="text-xs text-slate-500">
                    Payment: <strong className="uppercase">{ord.payment_method_display}</strong> ({ord.payment_status_display})
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 mr-2">Total Amount:</span>
                    <span className="text-base font-black text-slate-900">${Number(ord.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

