import React, { useState, useEffect } from 'react';
import {
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  BellRing,
} from 'lucide-react';
import { telegramService, TelegramConfig } from '../services/telegramService';
import { useToast } from '../context/ToastContext';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const cfg: TelegramConfig = await telegramService.getConfig();
      setIsConfigured(cfg.configured);
      setChatId(cfg.chat_id || '');
      setEnabled(cfg.enabled ?? true);
      if (cfg.bot_token_masked) {
        setBotToken(cfg.bot_token_masked);
      }
    } catch (err) {
      console.error('Failed to load telegram config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId.trim()) {
      showToast('Please enter your Telegram Chat ID', 'error');
      return;
    }
    setSaving(true);
    try {
      await telegramService.saveConfig({
        bot_token: botToken,
        chat_id: chatId,
        enabled,
      });
      showToast('Telegram Bot settings saved successfully!', 'success');
      setIsConfigured(true);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to save settings';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!chatId.trim()) {
      showToast('Please enter Chat ID first', 'error');
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await telegramService.testConnection({
        bot_token: botToken,
        chat_id: chatId,
      });
      setTestResult({
        ok: true,
        msg: res.message || 'Test message sent successfully! Check your Telegram app.',
      });
      showToast('Telegram message sent! Please check Telegram.', 'success');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to send test message';
      setTestResult({ ok: false, msg });
      showToast(msg, 'error');
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shadow-inner">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Telegram Bot Alerts</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isConfigured
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {isConfigured ? 'Connected' : 'Setup Required'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ទទួលសារជូនដំណឹងរាល់ពេលអតិថិជនកុម្ម៉ង់ &amp; បង់លុយតាម KHQR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Status banner */}
          <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-800/40 flex items-start gap-3">
            <BellRing className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block font-semibold mb-0.5">
                Real-Time Order &amp; Payment Notifications
              </strong>
              រាល់ពេលមានអ្នកបញ្ជាទិញថ្មី ឬបង់ប្រាក់រួចតាម ABA KHQR ប្រព័ន្ធនឹងផ្ញើសារលម្អិត (ឈ្មោះ, លេខទូរស័ព្ទ, អាសយដ្ឋាន, ទំនិញ, និងចំនួនទឹកប្រាក់) ទៅកាន់ Telegram របស់អ្នកភ្លាមៗ!
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Telegram Bot Token (ពី @BotFather)</span>
                <span className="text-[10px] font-mono text-slate-500">Secret HTTP API</span>
              </label>
              <input
                type="text"
                placeholder="ឧ. 7123456789:AAHxxxxxxxxxxxxxxxxxxxx"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Telegram Chat ID ឬ Group ID</span>
                <span className="text-[10px] font-mono text-slate-500">User / Group / Channel</span>
              </label>
              <input
                type="text"
                placeholder="ឧ. 123456789 ឬ -100123456789"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-sky-500"
                />
                <span>បើកដំណើរការបញ្ជូនសារស្វ័យប្រវត្តិ (Enable Alerts)</span>
              </label>
            </div>

            {/* Test result feedback */}
            {testResult && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                  testResult.ok
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                    : 'bg-rose-950/40 border border-rose-800/60 text-rose-300'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 font-mono text-[11px] leading-relaxed">
                  {testResult.msg}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || saving || !chatId}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Ping...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    តេស្តផ្ញើសារ (Test Message)
                  </>
                )}
              </button>

              <button
                type="submit"
                disabled={saving || testing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    រក្សាទុក (Save Bot)
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Setup Guide Accordion */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/60 space-y-3">
            <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" /> របៀបបង្កើត Telegram Bot (៣០ វិនាទី)
            </h4>
            <ol className="space-y-2 text-[11px] text-slate-400 list-decimal list-inside leading-relaxed">
              <li>
                ចូលកម្មវិធី <strong>Telegram</strong> ស្វែងរក <strong>@BotFather</strong> រួចផ្ញើពាក្យ <code className="text-sky-300">/newbot</code>
              </li>
              <li>
                ដាក់ឈ្មោះ Bot (ឧ. <em>ShopEase Alerts</em>) និង Username (ឧ. <em>shopease_order_bot</em>)
              </li>
              <li>
                ចម្លង <strong>HTTP API Token</strong> ដែលទទួលបាន យកមកបិទភ្ជាប់ (Paste) ក្នុងប្រអប់ Token ខាងលើ
              </li>
              <li>
                ដើម្បីដឹង <strong>Chat ID</strong> ផ្ទាល់ខ្លួន៖ ស្វែងរក <strong>@userinfobot</strong> ក្នុង Telegram ចុច Start វានឹងបង្ហាញលេខ Id របស់អ្នក
              </li>
              <li>
                <em>(ប្រសិនបើចង់ផ្ញើចូល Group/Channel)៖</em> គ្រាន់តែ Add Bot នោះចូល Group រួចផ្ញើ 1 សារដើម្បីយក Group Chat ID
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
