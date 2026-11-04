import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    try {
      await login(email, password);
      showToast('Signed in successfully! Welcome back.', 'success');
      router.push('/');
    } catch (err: any) {
      if (!err.response) {
        showToast('Backend server is not running! Please start Django on http://127.0.0.1:8000', 'error');
      } else {
        const msg = err.response?.data?.detail || err.response?.data?.error || 'Invalid email or password';
        showToast(msg, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
  };

  return (
    <MainLayout title="Sign In | ShopEase">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-100">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-500">
              Enter your credentials to access your ShopEase account
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Quick Demo Logins:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@shopease.com', 'admin123')}
                className="flex-1 py-1.5 px-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl font-semibold hover:bg-amber-100 transition-colors"
              >
                Admin User
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('customer@shopease.com', 'customer123')}
                className="flex-1 py-1.5 px-3 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-xl font-semibold hover:bg-indigo-100 transition-colors"
              >
                Customer User
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300 transition-all"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

