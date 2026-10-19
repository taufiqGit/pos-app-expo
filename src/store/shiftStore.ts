import { create } from "zustand";
import {
  CashierShift,
  endCashierShift,
  fetchCashierShiftStatus,
  startCashierShift,
} from "@/services/cashierShiftService";

interface ShiftState {
  /** Shift kasir yang sedang aktif (null = belum mulai shift) */
  activeShift: CashierShift | null;
  checking: boolean;

  /** Cek ulang status shift dari server (GET /api/cashier-shifts/status) */
  refreshStatus: () => Promise<CashierShift | null>;
  /** Mulai shift baru (POST /api/cashier-shifts/start) */
  start: (outletId: string, openingCash: number) => Promise<CashierShift>;
  /** Akhiri shift aktif (POST /api/cashier-shifts/end) */
  end: (closingCash?: number) => Promise<CashierShift>;
  clear: () => void;
}

/** Response status zero-value dari backend tidak punya id → dianggap tidak ada shift aktif. */
function pickActive(shift: CashierShift): CashierShift | null {
  return shift?.id ? shift : null;
}

export const useShiftStore = create<ShiftState>((set) => ({
  activeShift: null,
  checking: false,

  refreshStatus: async () => {
    set({ checking: true });
    try {
      const shift = await fetchCashierShiftStatus();
      const active = pickActive(shift);
      set({ activeShift: active });
      return active;
    } finally {
      set({ checking: false });
    }
  },

  start: async (outletId, openingCash) => {
    const shift = await startCashierShift(outletId, openingCash);
    set({ activeShift: shift });
    return shift;
  },

  end: async (closingCash) => {
    const shift = await endCashierShift(closingCash);
    set({ activeShift: null });
    return shift;
  },

  clear: () => set({ activeShift: null, checking: false }),
}));
