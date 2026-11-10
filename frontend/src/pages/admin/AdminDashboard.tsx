import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Package,
  ShoppingBag,
  Ticket,
  Users,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { couponService } from '../../services/couponService';
import { useToast } from '../../context/ToastContext';
import { Product, Order, Category, Coupon } from '../../types';
import { MOCK_CATEGORIES } from '../../data/fashionMockData';

export const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const currentTab = (router.query.tab as string) || 'overview';
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // New Product Modal Form
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<number | string>(MOCK_CATEGORIES[0]?.id || 1);
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  // New Coupon Form
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState('10');
  const [newCouponMin, setNewCouponMin] = useState('20');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodsRes, ordsRes, catsRes, coupsRes] = await Promise.allSettled([
        productService.getProducts({ admin: true }),
        orderService.getAllOrdersAdmin(),
        productService.getCategories(),
        couponService.getAllCouponsAdmin(),
      ]);

      if (prodsRes.status === 'fulfilled' && prodsRes.value.length > 0) {
        setProducts(prodsRes.value);
      }
      if (ordsRes.status === 'fulfilled') {
        setOrders(ordsRes.value);
      }
      if (catsRes.status === 'fulfilled' && catsRes.value.length > 0) {
        setCategories(catsRes.value);
        setNewProdCategory((prev) => prev || catsRes.value[0].id);
      } else {
        setCategories(MOCK_CATEGORIES);
      }
      if (coupsRes.status === 'fulfilled') {
        setCoupons(coupsRes.value);
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
      setCategories(MOCK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((acc, curr) => acc + Number(curr.total_amount), 0);

  const handleUpdateOrderStatus = async (orderId: number, status: string, paymentStatus?: string) => {
    try {
      await orderService.updateOrderStatusAdmin(orderId, status, paymentStatus);
      showToast('Order status updated successfully', 'success');
      fetchData();
    } catch {
      showToast('Failed to update order status', 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdCategory) return;

    setSavingProduct(true);
    try {
      const selectedCat = categories.find((c) => String(c.id) === String(newProdCategory)) || categories[0];
      const created = await productService.createProduct({
        name: newProdName,
        category: selectedCat ? (typeof selectedCat.id === 'number' ? selectedCat.id : selectedCat.slug) : newProdCategory,
        category_name: selectedCat?.name || 'Fashion & Apparel',
        category_slug: selectedCat?.slug || 'fashion-apparel',
        price: newProdPrice,
        stock_quantity: Number(newProdStock),
        main_image_url: newProdImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
        description: newProdDesc || `${newProdName} premium product.`,
        short_description: newProdDesc?.slice(0, 100) || `${newProdName} premium product.`,
      });
      setProducts((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
      showToast(`Product "${created.name}" created successfully!`, 'success');
      setShowProductModal(false);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdImage('');
      setNewProdDesc('');
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Failed to create product';
      showToast(msg, 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(slug);
      showToast('Product deleted', 'success');
      fetchData();
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    try {
      await couponService.createCouponAdmin({
        code: newCouponCode.toUpperCase(),
        discount_type: newCouponType,
        discount_value: newCouponVal,
        min_spend: newCouponMin,
      });
      showToast('Coupon created!', 'success');
      setShowCouponModal(false);
      setNewCouponCode('');
      fetchData();
    } catch {
      showToast('Failed to create coupon', 'error');
    }
  };

  return (
    <AdminLayout title="Control Panel | ShopEase">
      <div className="space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time store management, analytics, inventory, and order fulfillment.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowProductModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button
              onClick={() => setShowCouponModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Ticket className="w-4 h-4 text-amber-400" /> Add Coupon
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Total Paid Revenue</span>
              <h3 className="text-2xl font-black text-white mt-1">${totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Total Orders</span>
              <h3 className="text-2xl font-black text-white mt-1">{orders.length}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Products in Catalog</span>
              <h3 className="text-2xl font-black text-white mt-1">{products.length}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Active Coupons</span>
              <h3 className="text-2xl font-black text-white mt-1">{coupons.length}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab 1: Orders Management */}
        {(currentTab === 'overview' || currentTab === 'orders') && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              Recent Customer Orders ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No orders received yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase font-bold">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                          {ord.order_number}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{ord.shipping_name}</div>
                          <div className="text-[10px] text-slate-500">{ord.shipping_city}, {ord.shipping_phone}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {ord.items.length} items
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          ${Number(ord.total_amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.payment_status === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {ord.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-1 px-2 rounded-lg outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {ord.payment_status !== 'paid' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, ord.status, 'paid')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Products Catalog Management */}
        {(currentTab === 'overview' || currentTab === 'products') && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-400" />
                Products Catalog ({products.length})
              </h2>
              <button
                onClick={() => setShowProductModal(true)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
              >
                + New Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                          <img
                            src={p.display_image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-slate-500">SKU: {p.sku}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{p.category_name}</td>
                      <td className="py-3 px-4 font-bold text-white">${Number(p.price).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.stock_quantity > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {p.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-amber-400 font-bold">★ {Number(p.rating).toFixed(1)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.slug)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Coupons */}
        {(currentTab === 'coupons') && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-400" />
                Store Discount Coupons
              </h2>
              <button
                onClick={() => setShowCouponModal(true)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold"
              >
                + New Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-base font-black text-amber-400">{c.code}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full uppercase">
                      {c.discount_type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Discount: <strong>{c.discount_value}{c.discount_type === 'percentage' ? '%' : '$'}</strong>
                  </p>
                  <p className="text-xs text-slate-500">
                    Min Spend: ${Number(c.min_spend).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Add New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Mechanical RGB Keyboard"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {categories.length === 0 ? (
                      <option value="" disabled className="bg-slate-900 text-slate-400">Loading categories...</option>
                    ) : (
                      categories.map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-900 text-white py-1">
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="99.99"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Key features, specifications, and details..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-400 rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500"
                >
                  {savingProduct ? 'Creating...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Create Promo Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. FLASH30"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono uppercase outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Min Order Spend ($)</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-400 rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminDashboard;

