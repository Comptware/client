// types/index.ts

// --------------------
// User / Auth
// --------------------

export interface UserProfile {
  /** From Auth0 and (Backend - Optional) */
  auth0Id?: string;
  email?: string;

  /** From backend /auth/me */
  firstName: string;
  middleName?: string;
  lastName: string;
  uniqueClientId?: string; // Format: YYYY-NNNNN (e.g., 2026-20051)
  kycStatus: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  documents: string;
  documentNumber?: string;
  dateOfBirth?: string;
  address?: string; // Legacy field - keeping for backward compatibility
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  country?: string;
  roles: string[];
  permissions: string[];
  plan: 'BASIC' | 'STANDARD' | 'PREMIUM';
  hasPaid: boolean;
  depositPaid: boolean;
  hasSigned: boolean;
  depositAmount: number;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

  /** Wallet & preferences */
  walletAddress?: string;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    payoutFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
    currency: string;
  };
}

// --------------------
// Products & Cart
// --------------------

// Strict union of allowed product identifiers
export type ProductTypes =
  | "SUNCORE_BUNDLE"
  | "SUNCORE_BUNDLE_PLUS"
  | "SUNCORE_BUNDLE_TRIO"
  | "SUNCORE_POWER_PACK_125"
  | "SUNCORE_POWER_PACK_250"
  | "SUNCORE_POWER_PACK_500";

// ASIC spec coming from backend
export interface AsicSpec {
  id?: string;            // optional in CartItem (backend may not send it)
  model: string;
  hashRate: string;
  power: string;
  efficiency: string;
}

// CartItem inside /auth/me response
export interface CartItem {
  productType: ProductTypes;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isBooster: boolean;
  asicSpec?: AsicSpec;
  _id: string;
}

// --------------------
// Cart (two variants)
// --------------------

// Backend "raw" cart (from /auth/me?includeCart=true)
export interface BackendCart {
  _id: string;
  userId?: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  status: "ACTIVE" | "CHECKOUT" | "ABANDONED";
  depositApplied: number;
  remainingAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Frontend cart (from /cart)
export interface Cart extends BackendCart {
  currencySymbol: string;
  totalAmountUSD: number;
  locale?: string;
}

// /auth/me response
export interface GetCurrentUserResponse {
  user: UserProfile;
  cart?: Cart | null;
}

// --------------------
// Session (Auth0 SDK)
// --------------------
export interface Session {
  exp: number;
  internal: {
    createdAt: number;
    sid?: string;
  };
  tokenSet: {
    accessToken: string;
    expiresAt: number;
    idToken?: string;
    scope?: string;
  };
  user: {
    email: string;
    name: string;
    nickname: string;
    picture: string;
    sub: string;
  };
}

// --------------------
// KYC
// --------------------
export interface KycSubmitPayload {
  firstName: string;
  lastName: string;
  documents: 'PASSPORT' | 'ID_CARD' | 'DRIVER_LICENSE';
  documentNumber: string;
  dateOfBirth: string;
  address: string;
  country?: string; // Optional, lowercase alpha-2 code (e.g., "us")
  state?: string;
  city?: string; 

}

export interface KycSubmitResponse {
  message: string;
  redirectUrl: string;
  scanRef: string;
  token: string;
}

// --------------------
// Product Catalog
// --------------------

// Product metadata from /cart/products
export interface Product {
  value: ProductTypes; // enforce union
  label: string;
  /** All available prices, keyed by model name (or 'default') */
  prices: Record<string, number>;
  description: string;
  isBooster: boolean;
  specRefs: string[];
  country:string;
  currency:string;
  currencySymbol:string;
  locale:string;
  image?: string | null;
}

// Full response from /cart/products
export interface ProductsResponse {
  products: Product[];
  asicSpecs: AsicSpec[];
}

// --------------------
// Errors
// --------------------
export interface ErrorResponse {
  status?: string;
  statusCode?: number;
  message: string;
  timestamp?: string;
  traceId?: string;
  method?: string;
  url?: string;
}

export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  capital: string;
  currency: string;
  native: string;
  emoji: string;
}

export interface State {
  id: number;
  name: string;
  iso2: string;
}

export interface City {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

export interface KycDocumentType {
  value: string;
  label: string;
}

export type ProjectStageName =
  | 'PURCHASE'
  | 'FULFILLMENT'
  | 'ENERGY_INFRASTRUCTURE_INSTALLATION'
  | 'PROVISIONING'
  | 'TESTING'
  | 'ACTIVATION';

export interface ProjectStage {
  stage: ProjectStageName;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  updatedAt: string;
}

export interface ProjectProgress {
  currentStage: string;
  timeline: ProjectStage[];
  elapsedDays: number;
  totalDays: number;
  remainingDays: number;
  goLivePercent: number;
  isGoLive: boolean;
  completedAt?: string;
  expectedCompletion?: string;

}

// --------------------
// ASIC ROR
// --------------------

export interface AsicRorTotals {
  total_purchase_price_usd: number;
  total_earnings_usd: number;
  current_ror_percentage: number;
  timeframe_earnings_usd: number;
  timeframe_ror: number;
}

export interface TimeframeRange {
  start: string;
  end: string;
}

export interface AsicRorSummary {
  client_id: string;
  asic_id: string;
  asic_model: string;
  purchase_date: string;
  purchase_price_usd: number;
  total_earnings_usd: number;
  current_ror_percentage: number;
  timeframe: string;
  timeframe_range: TimeframeRange;
  timeframe_range_applied: TimeframeRange;
  timeframe_earnings_usd: number;
  timeframe_ror: number;
  is_dummy?: boolean;
}

export interface AsicRorChartPoint {
  date: string;
  earningsUsd: number;
}

export interface AsicRorItem {
  summary: AsicRorSummary;
  chart: AsicRorChartPoint[];
}

export interface AsicRorSummaryResponse {
  data: {
    totals: AsicRorTotals;
    items: AsicRorItem[];
    is_dummy: boolean;
  };
}

export interface AsicRorDetailsResponse {
  data: {
    summary: AsicRorSummary;
    chart: AsicRorChartPoint[];
  };
}

export type AsicRorTimeframe = '24h' | '7d' | '30d' | '90d' | 'ytd' | '1y' | '3y' | '5y' | '10y' | 'custom' | 'inception';