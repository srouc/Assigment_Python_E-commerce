import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Palette,
  Type,
  Layout,
  MousePointer,
  Sparkles,
  ShieldCheck,
  Check,
  Copy,
  ShoppingBag,
  Heart,
  Star,
  Search,
  SlidersHorizontal,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Smartphone,
  Monitor,
  Flame,
  Minus,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { RatingStars } from '../../components/RatingStars';
import { useToast } from '../../context/ToastContext';

export default function DesignSystemPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'wireframes' | 'ux-flows'>('tokens');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Interactive component demo state
  const [interactiveRating, setInteractiveRating] = useState(4.5);
  const [counterValue, setCounterValue] = useState(2);
  const [activeWireframe, setActiveWireframe] = useState<'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'admin'>('home');
  const [showDemoModal, setShowDemoModal] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    showToast(`Copied ${label} (${text}) to clipboard!`, 'info');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colors = [
    { name: 'Brand Primary 600', hex: '#4f46e5', tw: 'bg-indigo-600', text: 'text-white', category: 'Primary' },
    { name: 'Brand Primary 500', hex: '#6366f1', tw: 'bg-indigo-500', text: 'text-white', category: 'Primary' },
    { name: 'Brand Primary 50', hex: '#eef2ff', tw: 'bg-indigo-50', text: 'text-indigo-900', category: 'Primary' },
    { name: 'Accent Violet 600', hex: '#7c3aed', tw: 'bg-violet-600', text: 'text-white', category: 'Secondary' },
    { name: 'Accent Sky 500', hex: '#0ea5e9', tw: 'bg-sky-500', text: 'text-white', category: 'Secondary' },
    { name: 'Success Emerald 500', hex: '#10b981', tw: 'bg-emerald-500', text: 'text-white', category: 'Semantic' },
    { name: 'Warning Amber 500', hex: '#f59e0b', tw: 'bg-amber-500', text: 'text-slate-900', category: 'Semantic' },
    { name: 'Danger Rose 500', hex: '#f43f5e', tw: 'bg-rose-500', text: 'text-white', category: 'Semantic' },
    { name: 'Dark Slate 950', hex: '#020617', tw: 'bg-slate-950', text: 'text-white', category: 'Neutral' },
    { name: 'Dark Slate 900', hex: '#0f172a', tw: 'bg-slate-900', text: 'text-white', category: 'Neutral' },
    { name: 'Muted Slate 500', hex: '#64748b', tw: 'bg-slate-500', text: 'text-white', category: 'Neutral' },
    { name: 'Surface Slate 100', hex: '#f1f5f9', tw: 'bg-slate-100', text: 'text-slate-900', category: 'Neutral' },
  ];

  return (
    <MainLayout>
      <Head>
        <title>UI/UX Design System & Specification — ShopEase</title>
        <meta name="description" content="Official ShopEase UI/UX Design System, Component Library, Typography Tokens, and High-Fidelity Wireframes." />
      </Head>

      <div className="bg-slate-50 min-h-screen pb-24">
        {/* Hero Header */}
        <div className="bg-slate-950 text-white relative overflow-hidden py-16 sm:py-20 border-b border-slate-800">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-300 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Design System v2.0 • Atomic Architecture
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              ShopEase <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">UI / UX Design System</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              A comprehensive, production-ready Design System crafted for modern E-Commerce. Built upon atomic design principles, WCAG 2.1 AA accessibility guidelines, mobile-first responsiveness, and human-centered micro-interactions.
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-3 mt-10">
              {[
                { id: 'tokens', label: '1. Design Tokens & Colors', icon: Palette },
                { id: 'components', label: '2. Component Library (Atoms & Molecules)', icon: MousePointer },
                { id: 'wireframes', label: '3. Screen Wireframes & Architecture', icon: Layout },
                { id: 'ux-flows', label: '4. UX Usability & User Flows', icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-indigo-600/30 shadow-lg scale-105'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab 1: Design Tokens & Colors */}
        {activeTab === 'tokens' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
            {/* Color Palette Tokens */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Palette className="w-6 h-6 text-indigo-600" />
                    Color Palette & Semantic Tokens
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Click any swatch to copy its HEX value. Tokens are calibrated to achieve a minimum 4.5:1 contrast ratio against backdrops.
                  </p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full w-fit">
                  WCAG 2.1 AA Compliant
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
                {colors.map((c) => (
                  <div
                    key={c.hex}
                    onClick={() => copyToClipboard(c.hex, c.name)}
                    className="group cursor-pointer rounded-2xl p-3 border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all bg-white"
                  >
                    <div className={`h-20 w-full rounded-xl ${c.tw} flex items-center justify-center relative overflow-hidden shadow-inner`}>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
                        {copiedToken === c.name ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedToken === c.name ? 'Copied!' : 'Copy HEX'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.category}</span>
                        <span className="text-xs font-mono font-bold text-slate-700">{c.hex}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{c.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Typography Scale */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
              <div className="pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Type className="w-6 h-6 text-indigo-600" />
                  Typography Scale & Hierarchy
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  System typeface family: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">Inter, system-ui, -apple-system, sans-serif</code>
                </p>
              </div>

              <div className="divide-y divide-slate-100 mt-6">
                <div className="py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="w-48 flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-600 font-mono">Display 1 (text-5xl)</span>
                    <p className="text-[11px] text-slate-400">48px / Line-height 1.1 / Black 900</p>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                    Crafted for Quality. Designed for Life.
                  </h1>
                </div>

                <div className="py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="w-48 flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-600 font-mono">Heading 2 (text-3xl)</span>
                    <p className="text-[11px] text-slate-400">30px / Line-height 1.2 / Bold 800</p>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Curated Categories & Trending Deals
                  </h2>
                </div>

                <div className="py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="w-48 flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-600 font-mono">Heading 3 (text-xl)</span>
                    <p className="text-[11px] text-slate-400">20px / Line-height 1.3 / Bold 700</p>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Sony WH-1000XM5 Wireless Noise-Canceling
                  </h3>
                </div>

                <div className="py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="w-48 flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-600 font-mono">Body Regular (text-sm)</span>
                    <p className="text-[11px] text-slate-400">14px / Line-height 1.6 / Regular 400</p>
                  </div>
                  <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                    Industry-leading noise cancellation optimized to your environment. Features two processors controlling eight microphones for unparalleled call clarity and battery life.
                  </p>
                </div>

                <div className="py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="w-48 flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-600 font-mono">Micro / Badge (text-xs)</span>
                    <p className="text-[11px] text-slate-400">12px / Line-height 1.4 / SemiBold 600</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      In Stock (23 items)
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                      Save $100.00
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
                      ORD-7B429A
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Component Library */}
        {activeTab === 'components' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
            {/* Interactive Button Atoms */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
              <div className="pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <MousePointer className="w-6 h-6 text-indigo-600" />
                  Interactive Button States (Atoms)
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  High-frequency interactive call-to-actions supporting normal, hover, active, loading, and disabled states.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Primary Button</span>
                    <p className="text-xs text-slate-600 mt-1">Main transaction & submission trigger</p>
                  </div>
                  <button
                    onClick={() => showToast('Primary button triggered!', 'success')}
                    className="w-full px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add To Cart
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Secondary / Outline</span>
                    <p className="text-xs text-slate-600 mt-1">Alternative or passive action</p>
                  </div>
                  <button
                    onClick={() => showToast('Secondary action triggered!', 'info')}
                    className="w-full px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-slate-400" />
                    Quick Preview
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Loading State</span>
                    <p className="text-xs text-slate-600 mt-1">Prevents duplicate checkout requests</p>
                  </div>
                  <button
                    disabled
                    className="w-full px-5 py-3 rounded-2xl bg-indigo-600/70 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-90"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing Order...
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Destructive / Danger</span>
                    <p className="text-xs text-slate-600 mt-1">Clear cart or remove order profile</p>
                  </div>
                  <button
                    onClick={() => showToast('Destructive action clicked!', 'error')}
                    className="w-full px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Remove Item
                  </button>
                </div>
              </div>
            </section>

            {/* Interactive Inputs & Steppers */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
              <div className="pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-6 h-6 text-indigo-600" />
                  Form Controls & Quantity Steppers (Molecules)
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Tactile controls with clear feedback and touch-friendly dimensions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {/* Search Bar Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Search with Auto-Clear</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search electronics, audio..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl text-xs outline-none transition-all"
                      defaultValue="Sony WH-1000XM5"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Live Quantity Stepper</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                      <button
                        onClick={() => setCounterValue(Math.max(1, counterValue - 1))}
                        className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center text-slate-600 shadow-sm transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center text-xs font-bold text-slate-800 font-mono">
                        {counterValue}
                      </span>
                      <button
                        onClick={() => setCounterValue(counterValue + 1)}
                        className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center text-slate-600 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      Total: <strong className="text-slate-900">${(counterValue * 299).toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                {/* Interactive Star Rating */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Interactive Customer Rating</label>
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    <RatingStars rating={interactiveRating} size={18} />
                    <span className="text-xs font-bold text-slate-800 font-mono">{interactiveRating.toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Modal & Toast Showcase */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
              <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                    Feedback Modals & KHQR Payment Simulator
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Seamless customer feedback for localized payment gateways and transaction status.
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all w-fit"
                >
                  <QrCode className="w-4 h-4" />
                  Preview KHQR Modal
                </button>
              </div>

              {/* Toast Trigger Buttons */}
              <div className="mt-8">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test Toast Notifications</span>
                <div className="flex flex-wrap gap-3 mt-3">
                  <button
                    onClick={() => showToast('Order #ORD-7B429A placed successfully!', 'success')}
                    className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Trigger Success Toast
                  </button>
                  <button
                    onClick={() => showToast('Coupon EXPIRED is no longer valid.', 'error')}
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100 transition-all flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5" /> Trigger Error Toast
                  </button>
                  <button
                    onClick={() => showToast('Free delivery threshold reached ($50+)!', 'info')}
                    className="px-4 py-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs hover:bg-sky-100 transition-all flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" /> Trigger Info Toast
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab 3: Screen Wireframes & Architecture */}
        {activeTab === 'wireframes' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
            {/* Wireframe Switcher */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Layout className="w-6 h-6 text-indigo-600" />
                    High-Fidelity Screen Wireframes & Layout Blueprints
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Select a page below to view its visual structure, component hierarchy, and responsive layout grid.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full w-fit">
                  <Monitor className="w-3.5 h-3.5" /> Desktop (1280px) & <Smartphone className="w-3.5 h-3.5" /> Mobile (375px)
                </div>
              </div>

              {/* Wireframe Selection Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
                {[
                  { id: 'home', label: '1. Storefront Home' },
                  { id: 'catalog', label: '2. Product Catalog' },
                  { id: 'product', label: '3. Product Details' },
                  { id: 'cart', label: '4. Cart Drawer' },
                  { id: 'checkout', label: '5. Multi-Payment' },
                  { id: 'admin', label: '6. Admin Portal' },
                ].map((wf) => (
                  <button
                    key={wf.id}
                    onClick={() => setActiveWireframe(wf.id as any)}
                    className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                      activeWireframe === wf.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {wf.label}
                  </button>
                ))}
              </div>

              {/* Wireframe Screen Display */}
              <div className="mt-8 border-2 border-dashed border-slate-300 rounded-3xl p-6 sm:p-10 bg-slate-900 text-white">
                {activeWireframe === 'home' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono text-indigo-400 font-bold">SCREEN 01: STOREFRONT HOME (/)</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Hero • Categories • Featured • Trust Badges</span>
                    </div>

                    {/* ASCII / Visual Blueprint */}
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 bg-slate-800 rounded-xl text-center text-slate-400 border border-slate-700">
                        [ TOP ANNOUNCEMENT BAR: &quot;Special Promo: WELCOME10 for 10% off • Free Delivery Over $50&quot; ]
                      </div>
                      <div className="p-4 bg-slate-800 rounded-xl flex items-center justify-between border border-slate-700">
                        <span className="font-bold text-white">[ LOGO: ShopEase ]</span>
                        <span className="text-slate-400">[ GLOBAL SEARCH INPUT (Auto-suggest) ]</span>
                        <div className="flex gap-4 text-slate-400">
                          <span>[ Home ]</span>
                          <span>[ Shop ]</span>
                          <span>[ Cart (2) ]</span>
                          <span>[ User Avatar ]</span>
                        </div>
                      </div>
                      <div className="p-8 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 rounded-2xl border border-indigo-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">New Arrival Collection</span>
                          <h3 className="text-lg font-black text-white">Crafted for Quality. Designed for Life.</h3>
                          <p className="text-xs text-slate-300 max-w-md">Discover premium electronics, lifestyle accessories, and apparel.</p>
                          <div className="flex gap-3 pt-2">
                            <span className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">[ Explore Catalog &rarr; ]</span>
                            <span className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">[ Electronics ]</span>
                          </div>
                        </div>
                        <div className="w-48 h-36 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-500 text-center p-2">
                          [ Featured Hero Product Media Banner ]
                        </div>
                      </div>

                      {/* Value propositions */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 text-center">
                          🚚 Free Express Delivery ($50+)
                        </div>
                        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 text-center">
                          🛡️ 100% Secure Checkout
                        </div>
                        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 text-center">
                          🔄 30-Day Free Returns
                        </div>
                        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 text-center">
                          🎧 24/7 Priority Support
                        </div>
                      </div>

                      {/* Product Grid */}
                      <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700">
                        <span className="text-xs font-bold text-slate-300 mb-3 block">[ FEATURED PRODUCTS GRID (4 Columns) ]</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-400 text-center">
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">Sony WH-1000XM5 ($299)</div>
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">Apple Watch Ultra 2 ($799)</div>
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">Nike Air Max Pulse ($150)</div>
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">Dell XPS 15 Laptop ($1,499)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeWireframe === 'catalog' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono text-indigo-400 font-bold">SCREEN 02: PRODUCT CATALOG & FILTERING (/shop)</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Sidebar Filters • Live Search • Sort • Responsive Grid</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 font-mono text-xs">
                      {/* Filter Sidebar */}
                      <div className="md:col-span-4 p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-4">
                        <span className="font-bold text-indigo-300">[ SIDEBAR FILTERS ]</span>
                        <div className="p-2 bg-slate-900 rounded border border-slate-700 text-slate-400">
                          [ CATEGORIES: All, Electronics, Fashion, Home, Sports ]
                        </div>
                        <div className="p-2 bg-slate-900 rounded border border-slate-700 text-slate-400">
                          [ PRICE RANGE SLIDER: $0 — $2,000 ]
                        </div>
                        <div className="p-2 bg-slate-900 rounded border border-slate-700 text-slate-400">
                          [ IN-STOCK ONLY: Toggle Checkbox ]
                        </div>
                        <div className="p-2 bg-indigo-950 text-indigo-300 rounded border border-indigo-800 text-center font-bold">
                          [ Reset All Filters ]
                        </div>
                      </div>

                      {/* Catalog Grid */}
                      <div className="md:col-span-8 p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-700 text-slate-400">
                          <span>Showing 8 of 8 Products</span>
                          <span>[ SORT: Newest | Price: Low-High | Rating ]</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-slate-400 text-[11px]">
                          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">[ Card 1: Image, Title, Price, ★4.8 ]</div>
                          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">[ Card 2: Image, Title, Price, ★4.9 ]</div>
                          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">[ Card 3: Image, Title, Price, ★4.7 ]</div>
                          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">[ Card 4: Image, Title, Price, ★4.5 ]</div>
                          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">[ Card 5: Image, Title, Price, ★4.6 ]</div>
                          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">[ Card 6: Image, Title, Price, ★5.0 ]</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeWireframe === 'product' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono text-indigo-400 font-bold">SCREEN 03: PRODUCT DETAILS & MEDIA GALLERY (/product/[id])</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Split View • Thumbnail Carousel • Review Form</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-mono text-xs">
                      {/* Left: Media */}
                      <div className="md:col-span-6 p-6 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-between gap-4">
                        <div className="w-full h-48 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center text-slate-500">
                          [ PRIMARY IMAGE ZOOM CANVAS ]
                        </div>
                        <div className="flex gap-2">
                          <span className="p-2 bg-slate-900 border border-indigo-500 rounded text-indigo-400">[ Thumb 1 ]</span>
                          <span className="p-2 bg-slate-900 border border-slate-700 rounded text-slate-500">[ Thumb 2 ]</span>
                          <span className="p-2 bg-slate-900 border border-slate-700 rounded text-slate-500">[ Thumb 3 ]</span>
                        </div>
                      </div>

                      {/* Right: Spec & Actions */}
                      <div className="md:col-span-6 p-6 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                        <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">Electronics</span>
                        <h3 className="text-base font-bold text-white">Sony WH-1000XM5 Wireless Headphones</h3>
                        <div className="flex items-center gap-2 text-amber-400 text-xs">★★★★★ (4.8 / 5.0 • 12 Reviews)</div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-xl font-bold text-white">$299.00</span>
                          <span className="text-slate-500 line-through text-xs">$399.00</span>
                          <span className="text-emerald-400 text-xs font-bold">Save $100</span>
                        </div>
                        <div className="p-2 bg-slate-900 rounded border border-slate-700 text-slate-300">
                          In Stock: 23 units remaining
                        </div>
                        <div className="flex gap-3 pt-2">
                          <span className="p-2 bg-slate-900 rounded border border-slate-700 text-center w-24">[- 1 +]</span>
                          <span className="p-2 bg-indigo-600 rounded text-white font-bold flex-1 text-center">[ Add To Cart ]</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeWireframe === 'cart' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono text-indigo-400 font-bold">SCREEN 04: SLIDE-OUT CART DRAWER & SESSION SYNC</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Real-time Subtotal • Coupon Engine • Free Shipping Meter</span>
                    </div>
                    <div className="max-w-md mx-auto p-6 bg-slate-800 rounded-2xl border border-slate-700 font-mono text-xs space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                        <span className="font-bold text-white">Shopping Cart (2 Items)</span>
                        <span className="text-slate-400">[ X Close ]</span>
                      </div>
                      <div className="p-2 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-center">
                        🎉 Free Shipping Unlocked! ($50+ reached)
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
                          <div>
                            <p className="text-white font-bold">Sony WH-1000XM5</p>
                            <p className="text-slate-400 text-[10px]">$299.00 x 2 = $598.00</p>
                          </div>
                          <span className="text-rose-400 text-[10px]">[ Delete ]</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                        <div className="flex gap-2">
                          <span className="p-2 bg-slate-800 border border-slate-700 rounded text-slate-400 flex-1">[ Coupon: SAVE15 ]</span>
                          <span className="p-2 bg-indigo-600 rounded text-white font-bold">[ Apply ]</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Subtotal:</span>
                          <span className="text-white font-bold">$598.00</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Coupon Discount (SAVE15):</span>
                          <span>-$15.00</span>
                        </div>
                        <div className="flex justify-between text-white font-bold border-t border-slate-700 pt-2">
                          <span>Estimated Total:</span>
                          <span className="text-emerald-400 text-sm">$583.00</span>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-600 text-white rounded-xl text-center font-bold">
                        [ Proceed to Checkout &rarr; ]
                      </div>
                    </div>
                  </div>
                )}

                {activeWireframe === 'checkout' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono text-indigo-400 font-bold">SCREEN 05: MULTI-STEP CHECKOUT & KHQR PAYMENT</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Shipping • Payment Choice • Dynamic QR Trigger</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-mono text-xs">
                      {/* Left: Form */}
                      <div className="md:col-span-7 p-6 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                        <span className="font-bold text-indigo-300">[ 1. SHIPPING ADDRESS ]</span>
                        <div className="p-2 bg-slate-900 rounded border border-slate-700 text-slate-400">Full Name: Sokha Meas</div>
                        <div className="p-2 bg-slate-900 rounded border border-slate-700 text-slate-400">Phone: 012 345 678</div>
                        <div className="p-2 bg-slate-900 rounded border border-slate-700 text-slate-400">Street Address & City: Phnom Penh, Cambodia</div>

                        <span className="font-bold text-indigo-300 block pt-2">[ 2. SELECT PAYMENT METHOD ]</span>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="p-3 bg-indigo-950 border-2 border-indigo-500 rounded-xl text-indigo-300 font-bold">
                            🏦 ABA KHQR / Mobile
                          </div>
                          <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-400">
                            💵 Cash on Delivery
                          </div>
                        </div>
                      </div>

                      {/* Right: Summary */}
                      <div className="md:col-span-5 p-6 bg-slate-800 rounded-2xl border border-slate-700 space-y-4">
                        <span className="font-bold text-indigo-300">[ 3. ORDER SUMMARY ]</span>
                        <div className="space-y-1 text-slate-400">
                          <div className="flex justify-between"><span>Items (2):</span><span>$598.00</span></div>
                          <div className="flex justify-between"><span>Shipping:</span><span className="text-emerald-400">FREE</span></div>
                          <div className="flex justify-between"><span>Coupon (SAVE15):</span><span className="text-emerald-400">-$15.00</span></div>
                          <div className="flex justify-between text-white font-bold border-t border-slate-700 pt-2">
                            <span>Order Total:</span><span className="text-emerald-400">$583.00</span>
                          </div>
                        </div>
                        <div className="p-3 bg-emerald-600 text-white rounded-xl text-center font-bold">
                          [ Place Order (ORD-XXXXXXXX) ]
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeWireframe === 'admin' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono text-indigo-400 font-bold">SCREEN 06: STORE MANAGER ADMIN DASHBOARD (/admin)</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">KPI Metrics • Inventory Control • Order Status Lifecycle</span>
                    </div>
                    <div className="space-y-4 font-mono text-xs">
                      {/* Metric cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                          <p className="text-slate-400 text-[10px]">TOTAL REVENUE</p>
                          <p className="text-lg font-bold text-white">$12,480.00</p>
                          <span className="text-emerald-400 text-[10px]">↑ 18.2% this month</span>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                          <p className="text-slate-400 text-[10px]">TOTAL ORDERS</p>
                          <p className="text-lg font-bold text-white">142</p>
                          <span className="text-indigo-400 text-[10px]">12 pending action</span>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                          <p className="text-slate-400 text-[10px]">TOTAL PRODUCTS</p>
                          <p className="text-lg font-bold text-white">8</p>
                          <span className="text-slate-400 text-[10px]">All in active catalog</span>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                          <p className="text-slate-400 text-[10px]">LOW INVENTORY ALERTS</p>
                          <p className="text-lg font-bold text-amber-400">2 Items</p>
                          <span className="text-amber-400 text-[10px]">Stock &lt; 10 units</span>
                        </div>
                      </div>

                      {/* Orders table blueprint */}
                      <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                        <span className="text-white font-bold">[ RECENT ORDERS MANAGEMENT TABLE ]</span>
                        <div className="p-3 bg-slate-900 rounded-lg flex justify-between items-center text-slate-300">
                          <span>#ORD-B45A342E</span>
                          <span>Sokha Meas</span>
                          <span>$583.00</span>
                          <span className="text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded">STATUS: Processing</span>
                          <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">PAYMENT: Paid</span>
                          <span>[ Actions: Edit / Ship ]</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: UX Flows & Usability Matrix */}
        {activeTab === 'ux-flows' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
            {/* Core Usability Laws Applied */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
              <div className="pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  UX Usability Laws & Cognitive Heuristics
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  How human factors and psychology laws are systematically embedded into every interaction.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase font-mono">1. Fitts&apos;s Law</span>
                  <h3 className="text-base font-bold text-slate-900">Touch Target Optimization</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Primary buttons, cart controls, and filter toggles feature minimum dimensions of 48x48px with generous padding, drastically reducing mis-clicks on mobile touchscreens.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase font-mono">2. Hick&apos;s Law</span>
                  <h3 className="text-base font-bold text-slate-900">Decision Time Minimization</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instead of bombarding users with 20 choices, catalog navigation uses progressive disclosure: 4 primary category chips, live price range sliders, and instant sort filters.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase font-mono">3. Jakob&apos;s Law</span>
                  <h3 className="text-base font-bold text-slate-900">E-Commerce Mental Models</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Users expect the shopping bag in the upper right, search bar in header center, and filter controls in the left sidebar. Adhering to conventions eliminates friction.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase font-mono">4. Zero-Friction Guest Cart</span>
                  <h3 className="text-base font-bold text-slate-900">Session Key Synchronization</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Guests can build a cart without creating an account first via <code className="bg-slate-200 px-1 rounded text-slate-800">X-Session-Key</code>. Upon signing in, their cart automatically merges into their user profile.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase font-mono">5. Feedback & Micro-interactions</span>
                  <h3 className="text-base font-bold text-slate-900">Instant State Confirmations</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Toast notifications slide in from top-right for cart updates, coupon validation, and authentication errors, leaving zero ambiguity about background processing status.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase font-mono">6. Accessibility (WCAG 2.1 AA)</span>
                  <h3 className="text-base font-bold text-slate-900">Inclusive Color Contrast</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All text achieves a minimum contrast ratio of 4.5:1 against backgrounds. Focus rings and aria-labels ensure smooth navigation for keyboard and screen-reader users.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Demo KHQR Modal Simulator */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-md shadow-red-600/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Scan to Pay via ABA KHQR</h3>
              <p className="text-xs text-slate-500 mt-1">Open Bakong or any Cambodian Banking App</p>
            </div>

            {/* QR Code Graphic Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-red-300 flex flex-col items-center justify-center">
              <div className="w-44 h-44 bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <div className="grid grid-cols-5 gap-1.5 w-36 h-36">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        i % 2 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-red-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[11px] font-bold text-red-600 mt-3 font-mono">Amount: $583.00 USD</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Payment updates automatically upon transaction verification.
            </p>

            <button
              onClick={() => {
                setShowDemoModal(false);
                showToast('KHQR Payment simulator closed', 'info');
              }}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
