import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Package,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-40">
      {/* Top Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 text-[11px] sm:text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Special Promo
            </span>
            <span className="hidden sm:inline text-slate-400">
              Use code <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">WELCOME10</strong> for 10% off your first order!
            </span>
            <span className="sm:hidden text-slate-300">
              Use code <strong className="text-white font-mono">WELCOME10</strong> for 10% off
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <span>Free Delivery Over $50</span>
            <span className="text-slate-600">|</span>
            <span className="font-semibold text-slate-300">USD ($)</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header className="glass-panel border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                  ShopEase
                </span>
                <span className="text-[10px] font-bold text-slate-400 -mt-1 tracking-widest uppercase">
                  Modern Store
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Search premium electronics, apparel, lifestyle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 focus:bg-white border border-slate-200/60 focus:border-indigo-500 rounded-2xl text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400 shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
              <Link
                href="/"
                className={`relative py-1 transition-colors hover:text-indigo-600 ${
                  router.pathname === '/' ? 'text-indigo-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full' : ''
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`relative py-1 transition-colors hover:text-indigo-600 ${
                  router.pathname === '/shop' ? 'text-indigo-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full' : ''
                }`}
              >
                Shop All
              </Link>
              {isAuthenticated && (
                <Link
                  href="/orders"
                  className={`relative py-1 transition-colors hover:text-indigo-600 ${
                    router.pathname === '/orders' ? 'text-indigo-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full' : ''
                  }`}
                >
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-800 rounded-full text-xs font-bold border border-amber-300 hover:bg-amber-500/20 transition-all shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Open Cart"
                className="relative p-2.5 rounded-2xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-md animate-fade-in">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Dropdown / Sign In */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xs font-bold shadow-sm uppercase">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-700 max-w-[110px] truncate">
                      {user?.name || user?.email}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-slide-up"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Signed in as</p>
                        <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{user?.email}</p>
                      </div>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-indigo-500" />
                        Order History
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-50 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/auth/login"
                    className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-100 space-y-3 animate-fade-in">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-xs outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </form>

              <nav className="flex flex-col gap-1.5 pt-1 text-sm font-medium">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100"
                >
                  Shop Catalog
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100"
                  >
                    My Orders
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl font-bold text-amber-800 bg-amber-50"
                  >
                    Admin Control Panel
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
