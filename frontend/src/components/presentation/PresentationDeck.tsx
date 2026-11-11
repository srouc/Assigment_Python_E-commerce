import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  X,
  Sparkles,
  Layers,
  Database,
  Cpu,
  Smartphone,
  ShieldCheck,
  Zap,
  QrCode,
  Send,
  Lock,
  BarChart3,
  CheckCircle2,
  Printer,
  HelpCircle,
  Clock,
  ArrowRight,
  Monitor,
  ShoppingBag,
} from 'lucide-react';

interface Slide {
  id: number;
  category: string;
  categoryKm: string;
  title: string;
  titleKm: string;
  subtitle: string;
  content: React.ReactNode;
  speakerNotesKm: string;
  speakerNotesEn: string;
}

// 10 Comprehensive Project Presentation Slides
const SLIDES: Slide[] = [
  // Slide 1: Cover
  {
    id: 1,
    category: 'Project Defense 2026',
    categoryKm: 'បទបង្ហាញគម្រោងឆ្នាំ ២០២៦',
    title: 'ShopEase E-Commerce & FinTech Platform',
    titleKm: 'ប្រព័ន្ធពាណិជ្ជកម្មអេឡិចត្រូនិក និងទូទាត់ប្រាក់ទំនើប ShopEase',
    subtitle: 'Modern Full-Stack Architecture with Python Flask REST API, Next.js, Authentic Bakong KHQR, and Telegram Bot Automation.',
    speakerNotesKm: 'សូមជម្រាបសួរលោកគ្រូ អ្នកគ្រូ និងគណៈកម្មការ! ថ្ងៃនេះខ្ញុំសូមធ្វើបទបង្ហាញអំពីគម្រោង ShopEase ដែលជា E-Commerce Website បំពាក់ដោយបច្ចេកវិទ្យា Python Flask, Next.js, ប្រព័ន្ធទូទាត់ប្រាក់ ABA KHQR ស្របច្បាប់ និង Real-Time Telegram Bot Notification។',
    speakerNotesEn: 'Good day instructors and evaluators! Today I present ShopEase, a full-stack modern e-commerce platform integrating Python Flask REST API, Next.js, authentic Cambodian Bakong KHQR payments, and automated Telegram Bot dispatch.',
    content: (
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-6 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-semibold shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Python Web Application Assignment &bull; Academic Year 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          ShopEase{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
            Fashion &amp; Lifestyle
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Contemporary Luxury E-Commerce platform engineered for high-conversion retail, frictionless Bakong mobile banking payments, and real-time automated messaging.
        </p>

        {/* Tech Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-4">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Backend</span>
            <span className="text-sm font-black text-white">Python 3.11 + Flask</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">REST API &bull; JWT Auth</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">Frontend</span>
            <span className="text-sm font-black text-white">Next.js 14 + React</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">TypeScript &bull; Tailwind CSS</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">Cambodia FinTech</span>
            <span className="text-sm font-black text-white">Bakong KHQR</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">NBC Standard &bull; Deep-link</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Automation</span>
            <span className="text-sm font-black text-white">Telegram Bot</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">@shopeaseSN_bot</span>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 2: Problem & Solution
  {
    id: 2,
    category: 'Market Context',
    categoryKm: 'បញ្ហា & ចក្ខុវិស័យ',
    title: 'Problem Statement & The ShopEase Solution',
    titleKm: 'បញ្ហាប្រឈមនៃទីផ្សារ & ដំណោះស្រាយរបស់ ShopEase',
    subtitle: 'Addressing critical friction points in Cambodian digital commerce and customer order fulfillment.',
    speakerNotesKm: 'បច្ចុប្បន្ន E-Commerce នៅកម្ពុជាជួបបញ្ហាធំៗ ៣: ទី១ គឺការទូទាត់ប្រាក់ត្រូវផ្ញើ Screenshot តាមឆាតដោយដៃ, ទី២ គឺអត់មានការជូនដំណឹងបញ្ជាក់ការកុម្ម៉ង់ភ្លាមៗតាម Telegram, និងទី៣ គឺទម្រង់គេហទំព័រមិនមានភាព Responsive នៅលើទូរស័ព្ទ។ ShopEase ដោះស្រាយបញ្ហាទាំងអស់នេះដោយស្វ័យប្រវត្តិ។',
    speakerNotesEn: 'Traditional e-commerce in Cambodia suffers from manual payment screenshot verification, lack of real-time messaging updates, and clunky mobile UX. ShopEase solves these issues through native Bakong KHQR integration, automated Telegram bot alerts, and a responsive mobile-first UI.',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto py-2">
        {/* Problem Card */}
        <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Current E-Commerce Pain Points</h3>
              <span className="text-xs text-rose-400 font-semibold">បញ្ហាប្រឈមដែលជួបប្រទះ</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="text-rose-400 font-bold mt-0.5">&bull;</span>
              <div>
                <strong className="text-white">Manual Payment Proof:</strong> Customers must capture screenshots of bank transfers and send them manually via Facebook/Telegram chat.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-400 font-bold mt-0.5">&bull;</span>
              <div>
                <strong className="text-white">Delayed Order Alerts:</strong> Admins take hours to manually verify and acknowledge payments, causing abandoned carts.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-400 font-bold mt-0.5">&bull;</span>
              <div>
                <strong className="text-white">Fragmented User Experience:</strong> Websites lack responsive 375px mobile optimization and dynamic flash deals.
              </div>
            </li>
          </ul>
        </div>

        {/* Solution Card */}
        <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              ✅
            </div>
            <div>
              <h3 className="text-lg font-black text-white">The ShopEase Innovation</h3>
              <span className="text-xs text-emerald-400 font-semibold">ដំណោះស្រាយរបស់ ShopEase</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
              <div>
                <strong className="text-white">Authentic NBC Bakong KHQR:</strong> Instant dynamic scannable QR code generated directly inside the checkout modal with 5-min timer.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
              <div>
                <strong className="text-white">Instant Telegram Bot Dispatch:</strong> Automated order receipt with customer details and items pushed directly via <code className="text-emerald-300 font-mono">@shopeaseSN_bot</code>.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
              <div>
                <strong className="text-white">Luxury UX &amp; Lightning Theme:</strong> Adaptive Light/Dark mode (White to Black), ⚡ live Lightning Deals timer, and account order barrier.
              </div>
            </li>
          </ul>
        </div>
      </div>
    ),
  },

  // Slide 3: System Architecture
  {
    id: 3,
    category: 'System Design',
    categoryKm: 'ស្ថាបត្យកម្មប្រព័ន្ធ',
    title: 'Full-Stack Architecture & Data Pipeline',
    titleKm: 'រចនាសម្ព័ន្ធបច្ចេកវិទ្យា & លំហូរទិន្នន័យ (Architecture)',
    subtitle: 'Decoupled Client-Server model communicating over secure RESTful JSON APIs.',
    speakerNotesKm: 'ប្រព័ន្ធ ShopEase ត្រូវបានបែងចែកជា ៣ ថ្នាក់ (3-Tier Architecture): ខាងមុខ (Frontend) ប្រើប្រាស់ Next.js 14 និង TypeScript ដើម្បីល្បឿន និង SEO, ខាងក្រោយ (Backend) ប្រើ Python Flask REST API ជាមួយ SQLAlchemy និង JWT Token សម្រាប់សុវត្ថិភាពខ្ពស់។',
    speakerNotesEn: 'ShopEase is architected as a high-performance 3-tier system: Next.js 14 TypeScript frontend consumes stateless Python Flask REST API endpoints with JWT authentication and communicates with external services like NBC Bakong and Telegram.',
    content: (
      <div className="w-full max-w-5xl mx-auto py-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Tier 1 */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase">
                Presentation Tier
              </span>
              <Monitor className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="text-base font-bold text-white">Next.js 14 Frontend</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Server-side rendered React 18, TypeScript, Tailwind CSS, Lucide icons, Context API for global Cart and Auth state.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded-md text-slate-300">Theme Context</span>
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded-md text-slate-300">Cart Drawer</span>
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded-md text-slate-300">KHQR Generator</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-sky-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-black uppercase">
                Application Tier
              </span>
              <Cpu className="w-5 h-5 text-sky-400" />
            </div>
            <h4 className="text-base font-bold text-white">Python Flask REST API</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Python 3.11 backend serving endpoints for authentication, product management, checkout, and inventory tracking.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded-md text-slate-300">JWT Guards</span>
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded-md text-slate-300">SQLAlchemy ORM</span>
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded-md text-slate-300">Bcrypt Security</span>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                Data &amp; Services
              </span>
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-base font-bold text-white">Database &amp; External APIs</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Relational database schema storing users, products, orders, items, coupled with Bakong KHQR generator and Telegram API.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded-md text-slate-300">Bakong KHQR</span>
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded-md text-slate-300">Telegram Bot API</span>
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded-md text-slate-300">PostgreSQL/SQLite</span>
            </div>
          </div>
        </div>

        {/* Data Flow Strip */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <span className="font-bold text-indigo-400">Flow:</span>
          <span>1. Client places Order</span>
          <span>&rarr;</span>
          <span>2. Flask validates stock &amp; saves DB</span>
          <span>&rarr;</span>
          <span>3. KHQR payload rendered</span>
          <span>&rarr;</span>
          <span>4. Telegram Bot sends instant receipt</span>
        </div>
      </div>
    ),
  },

  // Slide 4: Lightning Deals & Catalog
  {
    id: 4,
    category: 'Core Feature',
    categoryKm: 'មុខងារសំខាន់',
    title: '⚡ Lightning Deals & Dynamic Catalog',
    titleKm: 'មុខងារ Lightning Deals & តារាងទំនិញទាន់សម័យ',
    subtitle: 'Real-time countdown timer, live stock claim progress bars, and instant keyword filtering.',
    speakerNotesKm: 'នៅលើ Homepage យើងបានបង្កើត Section ពិសេសមួយឈ្មោះថា Lightning Deals ដែលមាន Countdown Timer គិតជាម៉ោង នាទី វិនាទីជាក់ស្ដែង ព្រមទាំង Progress Bar បង្ហាញពីចំនួនទំនិញដែលបានលក់ចេញ ដើម្បីបង្កើនការទាក់ទាញដល់អតិថិជន។',
    speakerNotesEn: 'The homepage integrates a high-converting Lightning Deals flash sale engine featuring real-time synchronized countdown timers, visual stock claimed progress bars, and instantaneous multi-keyword search with category filters.',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto py-2 text-left">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            Flash Sale Conversion Engine
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Designed to create purchase urgency and drive immediate conversions through interactive countdowns and stock scarcity indicators.
          </p>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <span className="text-amber-400 font-bold">⏱️ Real-time Timer:</span>
              <span>Interval-driven countdown [HRS] : [MIN] : [SEC] updating every 1000ms.</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <span className="text-red-400 font-bold">🏷️ Dynamic Discounts:</span>
              <span>Automatic percentage calculation with original price strikethroughs.</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <span className="text-emerald-400 font-bold">📊 Stock Claim Bars:</span>
              <span>Visual progress bars showing real-time inventory claim percentages.</span>
            </div>
          </div>
        </div>

        {/* Interactive Mini Mockup */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 flex flex-col justify-center space-y-4 shadow-xl shadow-amber-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-amber-400" /> Live Demo Mockup
            </span>
            <div className="flex items-center gap-1 font-mono text-xs font-black text-white bg-slate-800 px-2.5 py-1 rounded-lg">
              <span className="text-amber-400">02</span>:<span>45</span>:<span>18</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white">Italian Virgin Wool Blazer</span>
              <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[10px] rounded-md">-30% OFF</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white">$145.00</span>
              <span className="text-xs text-slate-500 line-through">$210.00</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-400 h-2 rounded-full w-3/4"></div>
            </div>
            <span className="text-[10px] text-slate-400">75% Claimed &bull; Only 4 items left in stock</span>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 5: Product Detail Page & Swatches
  {
    id: 5,
    category: 'Core Feature',
    categoryKm: 'មុខងារសំខាន់',
    title: 'Product Detail Page (PDP) & Swatches',
    titleKm: 'ទំព័រលម្អិតទំនិញ & ការជ្រើសរើសពណ៌ទំហំ (PDP)',
    subtitle: 'Multi-angle image gallery, interactive hex color swatches, and size selectors.',
    speakerNotesKm: 'នៅលើទំព័រលម្អិតទំនិញ (Product Detail Page) អតិថិជនអាចមើលរូបភាពទំនិញច្បាស់ៗ, ជ្រើសរើសទំហំ (S, M, L, XL), និងជ្រើសរើសពណ៌តាម Color Swatch ដោយមាន active ring indicator និងការការពារ stock យ៉ាងត្រឹមត្រូវ។',
    speakerNotesEn: 'The Product Detail Page delivers an immersive luxury shopping experience featuring multi-angle image galleries, interactive hex color swatches with active ring feedback, responsive size selectors, and sticky mobile purchase bars.',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto py-2 text-left">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Interactive Swatches &amp; Sizing
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every garment and accessory supports dynamic color variants with live hex codes, multi-size selections, and real-time inventory validation before cart addition.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <span className="text-xs font-bold text-slate-400">Color Swatch Demo:</span>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-black ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 flex items-center justify-center cursor-pointer">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="w-7 h-7 rounded-full bg-indigo-600 ring-1 ring-slate-700 cursor-pointer" />
              <div className="w-7 h-7 rounded-full bg-amber-700 ring-1 ring-slate-700 cursor-pointer" />
              <div className="w-7 h-7 rounded-full bg-slate-200 ring-1 ring-slate-700 cursor-pointer" />
            </div>

            <span className="text-xs font-bold text-slate-400 block pt-1">Size Selector Demo:</span>
            <div className="flex items-center gap-2">
              {['S', 'M', 'L', 'XL'].map((s, idx) => (
                <span
                  key={s}
                  className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                    idx === 1
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            Mobile Sticky Action Bar
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            When viewed on mobile screens (375px), a floating sticky bottom action bar appears automatically, keeping the price and &quot;Add to Bag&quot; button always accessible regardless of scroll position.
          </p>
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 space-y-2">
            <span className="font-bold text-white block">Key Implementation Benefits:</span>
            <p>&bull; Prevents drop-offs by keeping CTA within thumb-reach.</p>
            <p>&bull; Responsive image zoom modal for inspecting fabric textures.</p>
            <p>&bull; Toast notifications on adding items to cart with live item count badge.</p>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 6: NBC Bakong KHQR Payment
  {
    id: 6,
    category: 'FinTech Innovation',
    categoryKm: 'ការទូទាត់ប្រាក់ទំនើប',
    title: 'Authentic NBC Bakong KHQR Integration',
    titleKm: 'ប្រព័ន្ធទូទាត់ប្រាក់ជាតិ ABA Bakong KHQR (Cambodia)',
    subtitle: 'Instant mobile banking checkout compliant with the National Bank of Cambodia standard.',
    speakerNotesKm: 'ចំណុចលេចធ្លោបំផុតនៃគម្រោងនេះ គឺការបំពាក់ប្រព័ន្ធទូទាត់ប្រាក់ ABA KHQR ស្តង់ដារធនាគារជាតិនៃកម្ពុជា។ នៅពេល Checkout ប្រព័ន្ធនឹង generate QR Code ជាក់ស្ដែង ព្រមទាំងមាន Countdown ៥នាទី និងសម្លេងបញ្ជាក់ការបង់ប្រាក់យ៉ាងត្រឹមត្រូវ។',
    speakerNotesEn: 'The standout feature of ShopEase is its native integration with the National Bank of Cambodia Bakong KHQR standard. It renders an authentic red merchant standee QR code supporting ABA Mobile, ACLEDA, Wing, and all Bakong member apps with a 5-minute expiry timer.',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto py-2 text-left">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-black uppercase">
            <QrCode className="w-3.5 h-3.5" /> NBC Bakong Standard
          </div>

          <h3 className="text-xl font-black text-white">
            Instant, Fee-Free Mobile Banking Scan
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Allows customers in Cambodia to complete payment in seconds without entering credit card numbers or waiting for manual confirmation.
          </p>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-red-400 font-bold">&check;</span>
              <span>Supports ABA Mobile, ACLEDA, Wing, Sathapana, and 50+ banks.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-400 font-bold">&check;</span>
              <span>Automatic 5-minute countdown clock to prevent stale orders.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-400 font-bold">&check;</span>
              <span>Audio payment chime played automatically upon verification.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-400 font-bold">&check;</span>
              <span>Cash on Delivery (COD) available as fallback payment option.</span>
            </li>
          </ul>
        </div>

        {/* Standee Mockup */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-red-500/30 flex flex-col items-center justify-center text-center space-y-3 shadow-xl shadow-red-500/5">
          <div className="w-full max-w-[260px] bg-white text-slate-900 rounded-2xl p-4 shadow-lg border border-slate-200 space-y-2">
            <div className="bg-red-600 text-white py-1 px-3 rounded-lg flex items-center justify-between">
              <span className="font-black text-xs tracking-wider">KHQR</span>
              <span className="text-[9px] font-bold">BAKONG</span>
            </div>
            <p className="text-[11px] font-bold text-slate-700">ShopEase Fashion Store</p>
            <div className="w-32 h-32 mx-auto bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center p-2">
              <QrCode className="w-24 h-24 text-slate-800" />
            </div>
            <div className="text-sm font-black text-slate-900">$160.00 USD</div>
            <div className="text-[10px] text-red-600 font-bold font-mono">Expires in 04:59</div>
          </div>
          <span className="text-[11px] text-slate-400">Authentic Standee Design compliant with NBC branding</span>
        </div>
      </div>
    ),
  },

  // Slide 7: Real-Time Telegram Bot Automation
  {
    id: 7,
    category: 'Messaging Automation',
    categoryKm: 'ស្វ័យប្រវត្តិកម្ម Telegram',
    title: 'Automated Real-Time Telegram Bot Service',
    titleKm: 'ប្រព័ន្ធផ្ញើសារ Telegram Bot ស្វ័យប្រវត្តិ (@shopeaseSN_bot)',
    subtitle: 'Instant asynchronous dispatch of receipts, tracking info, and admin order alerts.',
    speakerNotesKm: 'ដើម្បីដោះស្រាយបញ្ហាការឆ្លើយតបយឺត យើងបានបង្កើត Telegram Bot ផ្ទាល់ខ្លួន (@shopeaseSN_bot)។ រាល់ពេលមានការបញ្ជាទិញ ឬបង់ប្រាក់ជោគជ័យ ប្រព័ន្ធ Python Backend នឹងផ្ញើសារ Receipt លម្អិតទៅកាន់ Telegram ភ្លាមៗក្នុងរយៈពេលត្រឹមតែ ១ វិនាទី។',
    speakerNotesEn: 'To solve communication latency, we engineered a dedicated Telegram Bot service (@shopeaseSN_bot). Whenever an order is created or payment confirmed, the Python backend asynchronously dispatches a rich receipt directly to the configured Telegram chat.',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto py-2 text-left">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-black uppercase">
            <Send className="w-3.5 h-3.5" /> Telegram Bot API 2026
          </div>

          <h3 className="text-xl font-black text-white">
            Instant Order Alerts &amp; Customer Receipts
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Provides frictionless merchant-to-customer communication via Cambodia&apos;s most popular messaging app.
          </p>

          <div className="space-y-2 text-xs sm:text-sm text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <strong className="text-sky-400">Bot Handle:</strong>{' '}
              <a
                href="https://t.me/shopeaseSN_bot"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:underline font-mono"
              >
                @shopeaseSN_bot
              </a>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <strong className="text-sky-400">Asynchronous Python Service:</strong>{' '}
              <span>Built using requests and threading in <code className="text-sky-300">backend/telegram_service.py</code>.</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <strong className="text-sky-400">Formatted Receipts:</strong>{' '}
              <span>Includes Order Reference, Customer Phone (+855), Shipping Address, Total $, and Item List.</span>
            </div>
          </div>
        </div>

        {/* Telegram Mockup */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-sky-500/30 flex flex-col justify-center space-y-3 shadow-xl shadow-sky-500/5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
              ✈️
            </div>
            <div>
              <span className="text-xs font-bold text-white block">ShopEase Official Bot</span>
              <span className="text-[10px] text-emerald-400">bot &bull; online</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <p className="text-amber-400 font-bold">🛒 NEW ORDER RECEIVED!</p>
            <p>━━━━━━━━━━━━━━━━━</p>
            <p>📦 <strong>Order:</strong> #ORD-2026-8941</p>
            <p>👤 <strong>Customer:</strong> Srouch Srean</p>
            <p>📞 <strong>Phone:</strong> +855 12 345 678</p>
            <p>💳 <strong>Payment:</strong> ABA KHQR (VERIFIED)</p>
            <p>💰 <strong>Total Amount:</strong> $160.00 USD</p>
            <p>━━━━━━━━━━━━━━━━━</p>
            <p className="text-[10px] text-emerald-400">⚡ Status: Preparing for express delivery</p>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 8: Security & Authentication Guard
  {
    id: 8,
    category: 'Security & Access',
    categoryKm: 'សុវត្ថិភាព & គណនី',
    title: 'Security Architecture & Checkout Guard',
    titleKm: 'ប្រព័ន្ធសុវត្ថិភាព & ការទប់ស្កាត់ការកុម្ម៉ង់ដោយគ្មានគណនី',
    subtitle: 'Bcrypt hashing, stateless JWT authorization tokens, and guest checkout protection.',
    speakerNotesKm: 'ចំពោះសុវត្ថិភាព យើងបានកំណត់ថា User ដែលមិនទាន់មាន Account មិនអាច Order បានទេ (Account Required)។ ប្រព័ន្ធនឹង Redirect ទៅ Login/Register ហើយពេល Login រួចរាល់ វានឹងនាំត្រឡប់មក Checkout វិញដោយស្វ័យប្រវត្តិ។ ពាក្យសម្ងាត់ត្រូវបាន Hash ដោយ Bcrypt និងការពារដោយ JWT Token។',
    speakerNotesEn: 'Security is enforced at both frontend and backend layers. Guests are protected by an authentication guard requiring login before checkout with seamless redirect preservation. Passwords are encrypted with bcrypt, and API routes are secured via JWT tokens.',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto py-2 text-left">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" />
            Guest Checkout Barrier (តម្រូវឱ្យមានគណនី)
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To prevent fraudulent orders and ensure accurate shipping details, unauthenticated guests cannot submit checkout orders.
          </p>

          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300 space-y-2">
            <span className="font-bold text-white block">Checkout Guard Workflow:</span>
            <p>&bull; 1. Guest visits <code className="text-white">/checkout</code> &rarr; Lock banner displayed.</p>
            <p>&bull; 2. Clicks &quot;Login to Checkout&quot; &rarr; Navigates to <code className="text-white">/auth/login?redirect=/checkout</code>.</p>
            <p>&bull; 3. Upon successful auth &rarr; Instantly returned to <code className="text-white">/checkout</code> with all cart items preserved.</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Cryptographic &amp; API Security
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Industry-standard security protocols applied across all database operations and RESTful HTTP headers.
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">&check;</span>
              <span><strong>Bcrypt Hashing:</strong> Salted password storage with one-way hashing.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">&check;</span>
              <span><strong>JWT Authorization:</strong> Stateless bearer tokens for API authorization.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">&check;</span>
              <span><strong>Role-Based Access Control:</strong> Strict separation of User vs Admin privileges.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },

  // Slide 9: Admin Dashboard & Analytics
  {
    id: 9,
    category: 'Management',
    categoryKm: 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល',
    title: 'Admin Intelligence & Order Pipeline',
    titleKm: 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល & ការតាមដានស្ថានភាពទំនិញ (Admin Dashboard)',
    subtitle: 'Real-time revenue metrics, order fulfillment workflows, and catalog controls.',
    speakerNotesKm: 'Admin Dashboard ផ្ដល់ជូនម្ចាស់ហាងនូវស្ថិតិលក់ជាក់ស្ដែងដូចជា ចំណូលសរុប (Total Revenue), ចំនួនកុម្ម៉ង់ (Total Orders), និងស្ថានភាពទំនិញ (Pending, Processing, Shipped, Delivered) ដែលអាចផ្លាស់ប្តូរបានភ្លាមៗ។',
    speakerNotesEn: 'The Admin Dashboard provides store owners with real-time business intelligence including total revenue KPIs, active order counters, low-stock warnings, and an interactive order fulfillment status pipeline.',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto py-2 text-left">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase">
            <BarChart3 className="w-3.5 h-3.5" /> Real-Time Analytics
          </div>

          <h3 className="text-xl font-black text-white">
            Executive KPI Metrics &amp; Inventory
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Administrators gain complete visibility over financial transactions, stock claim percentages, and order processing workflows.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Sales</span>
              <span className="text-lg font-black text-emerald-400 block">$48,250.00</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Orders Placed</span>
              <span className="text-lg font-black text-indigo-400 block">342 Orders</span>
            </div>
          </div>
        </div>

        {/* Workflow Pipeline */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white">Order Status Lifecycle:</h4>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center text-amber-300">
              <span>1. Pending Payment</span>
              <span className="font-mono text-[10px]">Awaiting Scan</span>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 flex justify-between items-center text-sky-300">
              <span>2. Processing / Packaging</span>
              <span className="font-mono text-[10px]">Warehouse</span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex justify-between items-center text-indigo-300">
              <span>3. Shipped &amp; Dispatched</span>
              <span className="font-mono text-[10px]">Express Rider</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center text-emerald-300">
              <span>4. Completed &amp; Delivered</span>
              <span className="font-mono text-[10px]">Customer Signed</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 10: Conclusion & Demo
  {
    id: 10,
    category: 'Summary & Demo',
    categoryKm: 'សន្និដ្ឋាន & សំណួរចម្លើយ',
    title: 'Conclusion & Live Project Demonstration',
    titleKm: 'សេចក្តីសន្និដ្ឋាន & បទបង្ហាញជាក់ស្ដែង (Demo & Q&A)',
    subtitle: 'Achievements, production readiness scorecard, and interactive demonstration links.',
    speakerNotesKm: 'សរុបមក គម្រោង ShopEase ត្រូវបានបញ្ចប់ដោយជោគជ័យ ១០០% ដោយរួមបញ្ចូលទាំង Frontend, Backend, Database, ការទូទាត់ប្រាក់ Bakong KHQR, និង Telegram Bot Notification។ ខ្ញុំសូមអរគុណលោកគ្រូអ្នកគ្រូ និងរីករាយទទួលយកសំណួរ ឬមតិកែលម្អ! សូមអរគុណ។',
    speakerNotesEn: 'In conclusion, ShopEase successfully demonstrates a modern, scalable, and localized e-commerce solution integrating cutting-edge Python Flask architecture, Next.js UI, Cambodian FinTech, and real-time messaging. Thank you for your time and we welcome any questions!',
    content: (
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Project Milestones Completed &bull; 100% Functional</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Ready for Live Demonstration
        </h2>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Explore the live interactive application, inspect the code repository, test the Bakong KHQR payment flow, or launch an automated Telegram alert.
        </p>

        {/* Quick Demo Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Open Live Store
          </Link>

          <Link
            href="/admin"
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Open Admin Dashboard
          </Link>

          <a
            href="https://t.me/shopeaseSN_bot"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 font-bold text-xs sm:text-sm flex items-center gap-2 border border-sky-500/30 transition-all"
          >
            <Send className="w-4 h-4" />
            Test Telegram Bot
          </a>
        </div>

        <div className="pt-4 border-t border-slate-800 w-full max-w-xl text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Assignment: Python E-Commerce Platform &bull; Cambodia 2026</p>
          <p className="text-[11px] mt-1 text-slate-500">Thank you for your attention! Q&amp;A Session Open.</p>
        </div>
      </div>
    ),
  },
];

export const PresentationDeck: React.FC = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer for presentation duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-play slideshow
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }, 12000); // 12 seconds per slide in autoplay
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(SLIDES.length - 1);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setShowNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setShowThumbnails((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowNotes(false);
        setShowThumbnails(false);
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Handle slide query param
  useEffect(() => {
    if (router.query.slide) {
      const idx = parseInt(router.query.slide as string, 10) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < SLIDES.length) {
        setCurrentSlide(idx);
      }
    }
  }, [router.query.slide]);

  const current = SLIDES[currentSlide];

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-hidden' : ''
      }`}
    >
      {/* 1. Presentation Header Bar */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span className="hidden sm:inline">Back to Website</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-black text-white tracking-tight">ShopEase Presentation</span>
            <span className="hidden md:inline px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
              Slide Deck
            </span>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Elapsed Timer */}
          <button
            type="button"
            onClick={() => setTimerActive(!timerActive)}
            title="Click to pause/resume timer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 cursor-pointer hover:bg-slate-800"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </button>

          {/* Slide Indicator */}
          <button
            type="button"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs font-mono font-bold transition-all"
            title="Click to view all slides"
          >
            {currentSlide + 1} / {SLIDES.length}
          </button>

          {/* Speaker Notes Toggle */}
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            title="Toggle Speaker Notes (N)"
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              showNotes
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen (F)"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Help Toggle */}
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            title="Keyboard Shortcuts"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Progress Line */}
      <div className="w-full bg-slate-900 h-1">
        <div
          className="bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 h-1 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* 2. Main Stage (Slide Content) */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-6 relative z-10 max-w-7xl mx-auto w-full">
        {/* Slide Category & Sub-heading */}
        <div className="flex flex-col items-center justify-center text-center mb-4 space-y-1">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-indigo-400">
            {current.category} &bull; {current.categoryKm}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {current.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {current.titleKm}
          </p>
        </div>

        {/* Dynamic Slide Body */}
        <div className="my-auto w-full transition-all duration-300">
          {current.content}
        </div>
      </main>

      {/* 3. Speaker Notes Drawer (Bilingual Khmer + English) */}
      {showNotes && (
        <div className="mx-4 sm:mx-8 mb-4 p-4 rounded-3xl bg-slate-900/95 border border-amber-500/30 backdrop-blur-md shadow-2xl animate-fade-in relative z-20">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Presenter Notes (មតិណែនាំសម្រាប់ធ្វើបទបង្ហាញ)
            </span>
            <button
              type="button"
              onClick={() => setShowNotes(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs sm:text-sm">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                🇰🇭 កំណត់ត្រាភាសាខ្មែរ (Khmer Defense Notes):
              </span>
              <p className="text-slate-200 leading-relaxed font-normal">
                {current.speakerNotesKm}
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                🇬🇧 English Presentation Notes:
              </span>
              <p className="text-slate-200 leading-relaxed font-normal">
                {current.speakerNotesEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Slide Thumbnails Drawer */}
      {showThumbnails && (
        <div className="fixed inset-x-0 bottom-16 bg-slate-900/95 border-t border-slate-800 p-4 z-40 backdrop-blur-xl animate-slide-up max-h-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-bold text-slate-300">Jump to Slide ({SLIDES.length} total)</span>
              <button
                type="button"
                onClick={() => setShowThumbnails(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close &times;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {SLIDES.map((s, idx) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setShowThumbnails(false);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    idx === currentSlide
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono block font-bold text-indigo-400">
                    Slide {idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold truncate block mt-0.5">
                    {s.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Shortcuts Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                Keyboard Navigation
              </h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Next Slide</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">&rarr; or Space</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Previous Slide</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">&larr;</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Toggle Fullscreen</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">F</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Toggle Speaker Notes</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">N</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Show All Thumbnails</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">T</span>
              </div>
              <div className="flex justify-between py-1">
                <span>First / Last Slide</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">Home / End</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* 6. Bottom Navigation Controls Bar */}
      <footer className="px-4 sm:px-8 py-4 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          {/* Autoplay Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Autoplay' : 'Start Autoplay (12s per slide)'}
            className={`p-2.5 rounded-2xl border transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset to Slide 1 */}
          <button
            type="button"
            onClick={() => setCurrentSlide(0)}
            title="Restart Presentation (Slide 1)"
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Print Slides / PDF */}
          <button
            type="button"
            onClick={() => window.print()}
            title="Print Slides / Export to PDF"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>

        {/* Slide Counter Dots for quick visual glance */}
        <div className="hidden md:flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? 'w-6 bg-indigo-500'
                  : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Previous & Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none border border-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <span>{currentSlide === SLIDES.length - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
