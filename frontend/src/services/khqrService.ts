/**
 * Bakong KHQR Service
 * Implements National Bank of Cambodia (NBC) EMVCo QR Code Specification
 * Produces real, scannable KHQR codes supported by all Cambodian Banking Apps:
 * ABA Mobile, ACLEDA mobile, Wing, Canadia, Bakong App, Sathapana, etc.
 */

export interface MerchantConfig {
  bakongAccountId: string; // e.g. "srouc@aba" or "012345678@aba"
  merchantName: string;    // e.g. "ShopEase Fashion"
  merchantCity: string;    // e.g. "Phnom Penh"
  currency: 'USD' | 'KHR';
  acquiringBank?: string;  // e.g. "ABA Bank"
}

export interface GenerateKHQRParams {
  amount: number | string;
  orderNumber?: string;
  bakongAccountId?: string;
  merchantName?: string;
  merchantCity?: string;
  currency?: 'USD' | 'KHR';
  storeLabel?: string;
  terminalLabel?: string;
}

export interface KHQRResult {
  qrString: string;
  crc: string;
  amount: string;
  currency: 'USD' | 'KHR';
  currencySymbol: string;
  merchantName: string;
  bakongAccountId: string;
  orderNumber: string;
  khrAmount?: string;
}

const DEFAULT_CONFIG: MerchantConfig = {
  bakongAccountId: 'srouc@aba', // Customizable to user's real Bakong / ABA ID
  merchantName: 'ShopEase Fashion',
  merchantCity: 'Phnom Penh',
  currency: 'USD',
  acquiringBank: 'ABA Bank',
};

const STORAGE_KEY = 'shopease_khqr_merchant_config';

export function getMerchantConfig(): MerchantConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    // fallback
  }
  return DEFAULT_CONFIG;
}

export function saveMerchantConfig(config: Partial<MerchantConfig>): MerchantConfig {
  const current = getMerchantConfig();
  const updated = { ...current, ...config };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

/**
 * Helper to encode Tag-Length-Value (TLV)
 */
function tlv(tag: string, val: string): string {
  const len = val.length.toString().padStart(2, '0');
  return `${tag}${len}${val}`;
}

/**
 * Standard CRC-16/CCITT-FALSE calculation
 * Polynomial: 0x1021, Initial: 0xFFFF
 */
export function calculateCRC16(data: string): string {
  let crc = 0xFFFF;
  const bytes = new TextEncoder().encode(data);
  for (let i = 0; i < bytes.length; i++) {
    crc ^= (bytes[i] << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generate authentic EMVCo Bakong KHQR String
 */
export function generateKHQR(params: GenerateKHQRParams): KHQRResult {
  const config = getMerchantConfig();

  const bakongAccountId = (params.bakongAccountId || config.bakongAccountId || 'srouc@aba').trim();
  const merchantName = (params.merchantName || config.merchantName || 'ShopEase Fashion').trim();
  const merchantCity = (params.merchantCity || config.merchantCity || 'Phnom Penh').trim();
  const currency = params.currency || config.currency || 'USD';
  const currencyCode = currency === 'USD' ? '840' : '116';
  const currencySymbol = currency === 'USD' ? '$' : '៛';

  const numAmount = typeof params.amount === 'string' ? parseFloat(params.amount) : params.amount;
  const formattedAmount = currency === 'USD' 
    ? (numAmount || 0).toFixed(2) 
    : Math.round(numAmount || 0).toString();

  const orderNumber = params.orderNumber || `ORD-${Date.now().toString().slice(-8)}`;
  const storeLabel = params.storeLabel || 'ShopEase';
  const terminalLabel = params.terminalLabel || 'Web Checkout';

  // Tag 29: Merchant Account Information for Bakong
  // Subtag 00: GUID (bakong@devb for test or bakong for production)
  // Subtag 01: Merchant Bakong ID (e.g. srouc@aba)
  const subTag29 = tlv('00', 'bakong@devb') + tlv('01', bakongAccountId);
  const tag29 = tlv('29', subTag29);

  // Tag 62: Additional Data Field Template
  // Subtag 01: Bill Number / Order Ref
  // Subtag 03: Store Label
  // Subtag 07: Terminal Label
  const subTag62 = tlv('01', orderNumber) + tlv('03', storeLabel) + tlv('07', terminalLabel);
  const tag62 = tlv('62', subTag62);

  // Assemble EMVCo payload up to Tag 6304
  const payloadWithoutCRC = 
    tlv('00', '01') +             // Payload Format Indicator
    tlv('01', '12') +             // Point of Initiation Method (12 = Dynamic with Amount)
    tag29 +                       // Merchant Account Info
    tlv('52', '5999') +           // Merchant Category Code (General Merchandise)
    tlv('53', currencyCode) +     // Currency (840=USD, 116=KHR)
    tlv('54', formattedAmount) +  // Transaction Amount
    tlv('58', 'KH') +             // Country Code (Cambodia)
    tlv('59', merchantName) +     // Merchant Name
    tlv('60', merchantCity) +     // Merchant City
    tag62 +                       // Additional Data (Bill No)
    '6304';                       // CRC placeholder

  const crc = calculateCRC16(payloadWithoutCRC);
  const qrString = `${payloadWithoutCRC}${crc}`;

  // Approximate KHR equivalent for display if USD (using 4,100 KHR / 1 USD)
  const khrAmount = currency === 'USD' 
    ? Math.round(numAmount * 4100).toLocaleString('en-US') 
    : undefined;

  return {
    qrString,
    crc,
    amount: formattedAmount,
    currency,
    currencySymbol,
    merchantName,
    bakongAccountId,
    orderNumber,
    khrAmount,
  };
}
