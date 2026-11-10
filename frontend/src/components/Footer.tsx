import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-20 border-t border-slate-900">
      {/* Value Proposition Badges */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-900 text-indigo-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Free Express Delivery</h4>
                <p className="text-xs text-slate-500">On all orders over $50</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-900 text-indigo-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Secure Payments</h4>
                <p className="text-xs text-slate-500">100% encrypted checkout</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-900 text-indigo-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">30-Day Free Returns</h4>
                <p className="text-xs text-slate-500">Hassle-free money back</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-900 text-indigo-400">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">24/7 Priority Support</h4>
                <p className="text-xs text-slate-500">Always here to help you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ShopEase</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your premier destination for contemporary fashion, luxury tailoring, outerwear, and artisanal footwear.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Technology: Next.js Frontend + Python Flask REST Backend + MySQL
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop Catalog</Link></li>
              <li><Link href="/design-system" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors flex items-center gap-1.5">🎨 UI/UX Design System</Link></li>
              <li><Link href="/khqr" className="text-red-400 font-semibold hover:text-red-300 transition-colors flex items-center gap-1.5">🇰🇭 Real Bakong KHQR</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help & FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Demo Credentials</h4>
            <div className="bg-slate-900 p-3 rounded-xl text-xs space-y-1.5 font-mono text-slate-300">
              <p><span className="text-indigo-400">Admin:</span> admin@shopease.com</p>
              <p><span className="text-indigo-400">Pass:</span> admin123</p>
              <p className="pt-1 text-slate-500 border-t border-slate-800">
                <span className="text-indigo-400">Customer:</span> customer@shopease.com
              </p>
              <p><span className="text-indigo-400">Pass:</span> customer123</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ShopEase E-Commerce Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for high performance & clean architecture.
          </p>
        </div>
      </div>
    </footer>
  );
};

