import React, { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  ShieldCheck,
  Copy,
  Check,
  Download,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Building2,
  DollarSign,
  Info,
} from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { generateKHQR, getMerchantConfig, saveMerchantConfig, KHQRResult } from '../../services/khqrService';
import { useToast } from '../../context/ToastContext';

export default function KHQRGeneratorPage() {
  const { showToast } = useToast();
  const config = getMerchantConfig();

  const [bakongId, setBakongId] = useState(config.bakongAccountId);
  const [merchantName, setMerchantName] = useState(config.merchantName);
  const [merchantCity, setMerchantCity] = useState(config.merchantCity);
  const [currency, setCurrency] = useState<'USD' | 'KHR'>(config.currency);
  const [amount, setAmount] = useState('25.00');
  const [orderNumber, setOrderNumber] = useState(`ORD-${Date.now().toString().slice(-6)}`);
  const [copied, setCopied] = useState(false);

  // Generate real KHQR
  const khqr: KHQRResult = generateKHQR({
    amount: parseFloat(amount) || 0,
    orderNumber,
    bakongAccountId: bakongId,
    merchantName,
    merchantCity,
    currency,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(khqr.qrString);
    setCopied(true);
    showToast('Real EMVCo KHQR String copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsDefault = () => {
    saveMerchantConfig({
      bakongAccountId: bakongId,
      merchantName,
      merchantCity,
      currency,
    });
    showToast('Saved as store default KHQR configuration!', 'success');
  };

  return (
    <MainLayout title="Real Bakong KHQR Generator | ShopEase">
      <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              National Bank of Cambodia (NBC) EMVCo KHQR
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                <QrCode className="w-6 h-6" />
              </div>
              Real Bakong KHQR Generator
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">
              Generate scannable Cambodian KHQR codes compatible with ABA Mobile, ACLEDA, Wing, Canadia, and all Bakong apps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Input Form Controls */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Merchant & Payment Parameters
                </h2>
                <button
                  type="button"
                  onClick={handleSaveAsDefault}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Save as Default
                </button>
              </div>

              {/* Bakong Account ID */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Bakong Account ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={bakongId}
                    onChange={(e) => setBakongId(e.target.value)}
                    placeholder="e.g. srouc@aba or 012345678@aba"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl text-sm font-mono font-bold outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Format: <code className="text-slate-600">username@bank</code> (e.g., <code className="text-indigo-600">srouc@aba</code>, <code className="text-indigo-600">012345678@aba</code>, <code className="text-indigo-600">srouc@aclb</code>).
                </p>
              </div>

              {/* Merchant Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Merchant / Shop Name *
                </label>
                <input
                  type="text"
                  required
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g. ShopEase Fashion"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl text-sm font-bold outline-none"
                />
              </div>

              {/* Amount & Currency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl text-sm font-bold outline-none cursor-pointer"
                  >
                    <option value="USD">USD ($) — 840</option>
                    <option value="KHR">KHR (៛) — 116</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount *</label>
                  <input
                    type="number"
                    step={currency === 'USD' ? '0.01' : '100'}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="25.00"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl text-sm font-mono font-bold outline-none"
                  />
                </div>
              </div>

              {/* Bill Number & City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Order / Bill Ref</label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="ORD-001"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Merchant City</label>
                  <input
                    type="text"
                    value={merchantCity}
                    onChange={(e) => setMerchantCity(e.target.value)}
                    placeholder="Phnom Penh"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              {/* Helpful Tips Box */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>How Real KHQR Payments Work:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-indigo-800 space-y-1">
                  <li>Any customer with <strong>ABA Mobile</strong> or any Cambodian banking app scans the QR on the right.</li>
                  <li>Their app automatically reads your name, account, and exact amount.</li>
                  <li>When they press Confirm, the money transfers directly into your bank account.</li>
                </ul>
              </div>
            </div>

            {/* Right: The Authentic Red Bakong KHQR Card */}
            <div className="lg:col-span-6 flex flex-col items-center">
              
              {/* Standee Frame */}
              <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/80">
                
                {/* Red Header Banner */}
                <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-6 py-5 text-white text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <span className="text-2xl font-black tracking-widest uppercase">KHQR</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold tracking-wider">
                      BAKONG
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight truncate">
                    {khqr.merchantName}
                  </h3>
                  <p className="text-[11px] text-red-100 font-mono mt-0.5">
                    {khqr.bakongAccountId}
                  </p>
                </div>

                {/* Amount Ribbon */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Payable Total
                    </span>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {khqr.currencySymbol}{khqr.amount} <span className="text-xs font-bold text-slate-500">{khqr.currency}</span>
                    </div>
                  </div>
                  {khqr.khrAmount && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Equivalent KHR
                      </span>
                      <span className="text-xs font-bold text-slate-600 font-mono">
                        ≈ {khqr.khrAmount} ៛
                      </span>
                    </div>
                  )}
                </div>

                {/* QR Code Container */}
                <div className="p-6 flex flex-col items-center justify-center bg-white">
                  <div className="relative p-4 rounded-3xl bg-white border-2 border-slate-100 shadow-md">
                    <QRCodeSVG
                      value={khqr.qrString}
                      size={220}
                      level="M"
                      className="w-52 h-52"
                    />

                    {/* Center Emblem */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-lg border-2 border-white">
                        {khqr.currencySymbol}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Scannable with all Cambodian Bank Apps</span>
                  </div>

                  <div className="mt-3 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">
                      EMVCo CRC: <strong className="text-slate-600">{khqr.crc}</strong> | Ref: {khqr.orderNumber}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy KHQR String'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print Card
                  </button>
                </div>
              </div>

              {/* Raw EMVCo Data Accordion */}
              <div className="w-full max-w-sm mt-4 p-3 bg-white rounded-2xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Generated EMVCo Raw String:</span>
                <p className="font-mono text-[10px] text-slate-500 break-all bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {khqr.qrString}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}
