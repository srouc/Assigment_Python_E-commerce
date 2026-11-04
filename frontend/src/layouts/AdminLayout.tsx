import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  Users,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title = 'ShopEase Admin Portal',
}) => {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-slate-500 text-sm max-w-sm mt-1">
          You need an Administrator account to view this control panel. Please sign in as an administrator.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin?tab=products', icon: Package },
    { label: 'Orders', href: '/admin?tab=orders', icon: ShoppingBag },
    { label: 'Coupons', href: '/admin?tab=coupons', icon: Ticket },
    { label: 'Users', href: '/admin?tab=users', icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      <Head>
        <title>{title}</title>
      </Head>

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              SE
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Admin Portal</h1>
              <p className="text-[11px] text-amber-400 font-medium">Control Center</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.asPath === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Customer Store
          </Link>
          <div className="px-3.5 py-2 text-[11px] text-slate-600 truncate">
            Signed as: {user?.email}
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {children}
      </main>
    </div>
  );
};

