// ─── Tax Rates ────────────────────────────────────────────────────────────────
export const TAX_RATES = {
  NONE: 0,
  REDUCED: 0.05,
  STANDARD: 0.1,
  HIGH: 0.2,
} as const;

export type TaxRateKey = keyof typeof TAX_RATES;

// ─── Currencies ───────────────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

// ─── User Roles ───────────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN: "admin",
  CASHIER: "cashier",
  MANAGER: "manager",
  VIEWER: "viewer",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// ─── Role Permissions ─────────────────────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [ROLES.ADMIN]: ["view", "create", "edit", "delete", "reports", "settings"],
  [ROLES.MANAGER]: ["view", "create", "edit", "reports"],
  [ROLES.CASHIER]: ["view", "create"],
  [ROLES.VIEWER]: ["view"],
};

// ─── Payment Methods ──────────────────────────────────────────────────────────
export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  QR: "qr",
  SPLIT: "split",
} as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

// ─── Order Status ─────────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// ─── Discount Types ───────────────────────────────────────────────────────────
export const DISCOUNT_TYPES = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
} as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// ─── Receipt ──────────────────────────────────────────────────────────────────
export const RECEIPT = {
  STORE_NAME: "My POS Store",
  STORE_ADDRESS: "123 Main Street, City, Country",
  STORE_PHONE: "+1 (555) 000-0000",
  FOOTER_MESSAGE: "Thank you for your purchase!",
} as const;

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN: "@pos_auth_token",
  USER_SESSION: "@pos_user_session",
  CART: "@pos_cart",
  SETTINGS: "@pos_settings",
} as const;

// ─── API ──────────────────────────────────────────────────────────────────────
export const API = {
  BASE_URL: "https://api.myposapp.com/v1",
  TIMEOUT_MS: 10_000,
} as const;
