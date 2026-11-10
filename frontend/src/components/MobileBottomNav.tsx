import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Grid,
  ShoppingBag,
  Package,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  const currentPath = router.pathname;

  const isHome = currentPath === '/';
  const isShop = currentPath.startsWith('/shop') || currentPath.startsWith('/product');
  const isOrders = currentPath.startsWith('/orders');
  const isAdminPath = currentPath.startsWith('/admin');

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isHome ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* Catalog */}
        <Link
          href="/shop"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isShop ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className={`w-5 h-5 ${isShop ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Catalog</span>
        </Link>

        {/* Bag (Cart Trigger) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-500 hover:text-slate-800 transition-all active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Bag</span>
        </button>

        {/* Orders */}
        <Link
          href="/orders"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isOrders ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className={`w-5 h-5 ${isOrders ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Orders</span>
        </Link>

        {/* Account / Admin */}
        {isAdmin ? (
          <Link
            href="/admin"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              isAdminPath ? 'text-amber-600 font-bold' : 'text-amber-700/80 hover:text-amber-900'
            }`}
          >
            <ShieldCheck className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] tracking-tight">Admin</span>
          </Link>
        ) : isAuthenticated ? (
          <Link
            href="/orders"
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-500 hover:text-slate-800 transition-all"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] tracking-tight">Profile</span>
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-500 hover:text-slate-800 transition-all"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] tracking-tight">Sign In</span>
          </Link>
        )}

      </div>
    </div>
  );
};

