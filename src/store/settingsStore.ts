import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'TRY' | 'JPY' | 'AUD' | 'CAD';

export type PrinterConnectionType = 'bluetooth' | 'wifi' | 'usb';

export interface TaxRate {
  id: string;
  name: string;
  rate: number; // percentage, e.g. 8.5 for 8.5%
  isDefault: boolean;
}

export interface CurrencySettings {
  code: CurrencyCode;
  symbol: string;
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  symbolPosition: 'before' | 'after';
}

export interface PrinterSettings {
  enabled: boolean;
  connectionType: PrinterConnectionType;
  deviceName: string | null;
  deviceAddress: string | null; // IP for wifi, MAC for bluetooth
  paperWidth: 58 | 80; // mm
  autoPrint: boolean;
}

export interface SettingsState {
  // Tax
  taxRates: TaxRate[];
  activeTaxRateId: string | null;

  // Currency
  currency: CurrencySettings;

  // Printer
  printer: PrinterSettings;

  // General
  storeName: string;
  storeAddress: string;
  storePhone: string;
  receiptFooterNote: string;
  darkMode: boolean;
  language: string;

  // Actions — Tax
  addTaxRate: (taxRate: Omit<TaxRate, 'id'>) => void;
  updateTaxRate: (id: string, updates: Partial<Omit<TaxRate, 'id'>>) => void;
  removeTaxRate: (id: string) => void;
  setActiveTaxRate: (id: string) => void;

  // Actions — Currency
  setCurrency: (currency: Partial<CurrencySettings>) => void;

  // Actions — Printer
  setPrinter: (printer: Partial<PrinterSettings>) => void;
  resetPrinter: () => void;

  // Actions — General
  setStoreName: (name: string) => void;
  setStoreAddress: (address: string) => void;
  setStorePhone: (phone: string) => void;
  setReceiptFooterNote: (note: string) => void;
  setDarkMode: (enabled: boolean) => void;
  setLanguage: (language: string) => void;

  // Reset
  resetSettings: () => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_TAX_RATES: TaxRate[] = [
  { id: 'tax-1', name: 'Standard', rate: 10, isDefault: true },
  { id: 'tax-2', name: 'Reduced',  rate: 5,  isDefault: false },
  { id: 'tax-3', name: 'Zero',     rate: 0,  isDefault: false },
];

const DEFAULT_CURRENCY: CurrencySettings = {
  code: 'USD',
  symbol: '$',
  decimalPlaces: 2,
  thousandsSeparator: ',',
  decimalSeparator: '.',
  symbolPosition: 'before',
};

const DEFAULT_PRINTER: PrinterSettings = {
  enabled: false,
  connectionType: 'bluetooth',
  deviceName: null,
  deviceAddress: null,
  paperWidth: 80,
  autoPrint: false,
};

const DEFAULT_STATE: Omit<
  SettingsState,
  | 'addTaxRate'
  | 'updateTaxRate'
  | 'removeTaxRate'
  | 'setActiveTaxRate'
  | 'setCurrency'
  | 'setPrinter'
  | 'resetPrinter'
  | 'setStoreName'
  | 'setStoreAddress'
  | 'setStorePhone'
  | 'setReceiptFooterNote'
  | 'setDarkMode'
  | 'setLanguage'
  | 'resetSettings'
> = {
  taxRates: DEFAULT_TAX_RATES,
  activeTaxRateId: 'tax-1',
  currency: DEFAULT_CURRENCY,
  printer: DEFAULT_PRINTER,
  storeName: 'My POS Store',
  storeAddress: '',
  storePhone: '',
  receiptFooterNote: 'Thank you for your purchase!',
  darkMode: false,
  language: 'en',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateId = (): string =>
  `tax-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ─── Store ───────────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      // ── Tax ──────────────────────────────────────────────────────────────
      addTaxRate: (taxRate) =>
        set((state) => ({
          taxRates: [...state.taxRates, { ...taxRate, id: generateId() }],
        })),

      updateTaxRate: (id, updates) =>
        set((state) => ({
          taxRates: state.taxRates.map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          ),
        })),

      removeTaxRate: (id) =>
        set((state) => ({
          taxRates: state.taxRates.filter((t) => t.id !== id),
          activeTaxRateId:
            state.activeTaxRateId === id ? null : state.activeTaxRateId,
        })),

      setActiveTaxRate: (id) => set({ activeTaxRateId: id }),

      // ── Currency ─────────────────────────────────────────────────────────
      setCurrency: (currency) =>
        set((state) => ({
          currency: { ...state.currency, ...currency },
        })),

      // ── Printer ──────────────────────────────────────────────────────────
      setPrinter: (printer) =>
        set((state) => ({
          printer: { ...state.printer, ...printer },
        })),

      resetPrinter: () => set({ printer: DEFAULT_PRINTER }),

      // ── General ──────────────────────────────────────────────────────────
      setStoreName: (storeName) => set({ storeName }),
      setStoreAddress: (storeAddress) => set({ storeAddress }),
      setStorePhone: (storePhone) => set({ storePhone }),
      setReceiptFooterNote: (receiptFooterNote) =>
        set({ receiptFooterNote }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setLanguage: (language) => set({ language }),

      // ── Reset ─────────────────────────────────────────────────────────────
      resetSettings: () => set(DEFAULT_STATE),
    }),
    {
      name: 'pos-settings-storage',
    },
  ),
);

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectActiveTaxRate = (state: SettingsState): TaxRate | null =>
  state.taxRates.find((t) => t.id === state.activeTaxRateId) ?? null;

export const selectActiveTaxRateValue = (state: SettingsState): number =>
  selectActiveTaxRate(state)?.rate ?? 0;

export const selectCurrencySymbol = (state: SettingsState): string =>
  state.currency.symbol;

export const selectIsPrinterReady = (state: SettingsState): boolean =>
  state.printer.enabled && state.printer.deviceAddress !== null;
