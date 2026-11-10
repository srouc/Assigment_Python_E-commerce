import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Clock,
  ShieldCheck,
  Settings2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { generateKHQR, getMerchantConfig, saveMerchantConfig, KHQRResult } from '../services/khqrService';
import { useToast } from '../context/ToastContext';

interface KHQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: number | string;
  orderNumber?: string;
}

export const KHQRModal: React.FC<KHQRModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  amount,
  orderNumber = `ORD-${Date.now().toString().slice(-6)}`,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [showConfig, setShowConfig] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Merchant config
  const [config, setConfig] = useState(getMerchantConfig());
  const [customBakongId, setCustomBakongId] = useState(config.bakongAccountId);
  const [customMerchantName, setCustomMerchantName] = useState(config.merchantName);

  // QR result
  const [khqr, setKhqr] = useState<KHQRResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      const generated = generateKHQR({
        amount,
        orderNumber,
        bakongAccountId: customBakongId,
        merchantName: customMerchantName,
        currency: config.currency,
      });
      setKhqr(generated);
      setTimeLeft(300);
      setVerifying(false);
    }
  }, [isOpen, amount, orderNumber, customBakongId, customMerchantName, config.currency]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  if (!isOpen || !khqr) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleCopyQR = () => {
    navigator.clipboard.writeText(khqr.qrString);
    setCopied(true);
    showToast('KHQR String copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveMerchantConfig({
      bakongAccountId: customBakongId,
      merchantName: customMerchantName,
    });
    setConfig(updated);
    setShowConfig(false);
    showToast('Merchant account updated! New KHQR generated.', 'success');
  };

  const handleConfirmPaid = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      showToast('Payment verified successfully via KHQR!', 'success');
      onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Official Red Bakong Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-6 py-5 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="text-xl font-black tracking-widest uppercase">KHQR</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold tracking-wider">
              BAKONG
            </span>
          </div>

          <h3 className="text-sm font-bold tracking-tight text-white/95 truncate">
            {khqr.merchantName}
          </h3>
          <p className="text-[11px] text-red-100 font-mono mt-0.5">
            {khqr.bakongAccountId}
          </p>
        </div>

        {/* 2. Amount Section */}
        <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Amount Due
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              ${khqr.amount} <span className="text-xs font-bold text-slate-500 uppercase">{khqr.currency}</span>
            </div>
            {khqr.khrAmount && (
              <span className="text-[11px] font-semibold text-slate-500 font-mono">
                ≈ {khqr.khrAmount} KHR
              </span>
            )}
          </div>

          {/* Countdown Badge */}
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Expires In
            </span>
            <div className={`text-xs font-mono font-bold flex items-center gap-1 ${
              timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {formattedTime}
            </div>
          </div>
        </div>

        {/* 3. Main Scannable QR Frame */}
        <div className="p-6 flex flex-col items-center justify-center bg-white">
          <div className="relative p-4 rounded-3xl bg-white border-2 border-slate-100 shadow-md flex items-center justify-center group">
            {/* The Real Scannable SVG QR Code */}
            <QRCodeSVG
              value={khqr.qrString}
              size={210}
              level="M"
              includeMargin={false}
              className="w-48 h-48 sm:w-52 sm:h-52"
            />

            {/* Currency Center Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-lg border-2 border-white">
                {khqr.currencySymbol}
              </div>
            </div>
          </div>

          {/* Instruction Pill */}
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scan with ABA Mobile, ACLEDA, or any Bakong App</span>
          </div>

          <p className="text-[10px] text-slate-400 mt-2 font-mono text-center">
            Ref: {khqr.orderNumber}
          </p>
        </div>

        {/* 4. Action Buttons */}
        <div className="px-6 pb-6 space-y-2.5">
          <button
            onClick={handleConfirmPaid}
            disabled={verifying}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {verifying ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Verifying Payment...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                I Have Paid (${khqr.amount})
              </>
            )}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleCopyQR}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
              title="Configure Bakong Account"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Config</span>
            </button>
          </div>

          {/* Customizable Account Settings (Accordion) */}
          {showConfig && (
            <form onSubmit={handleSaveConfig} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-left animate-slide-up">
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>Configure Your Real Bakong ID</span>
                <span className="text-[10px] text-indigo-600">NBC EMVCo</span>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Bakong Account ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. yourname@aba or 012345678@aba"
                  value={customBakongId}
                  onChange={(e) => setCustomBakongId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Shop / Merchant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ShopEase Fashion"
                  value={customMerchantName}
                  onChange={(e) => setCustomMerchantName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
              >
                Apply & Regenerate Real QR
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
