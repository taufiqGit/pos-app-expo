import { create } from "zustand";
import { CartItem } from "../types/cart";

export type CheckoutMethod = "cash" | "card" | "ewallet";

export interface CheckoutReceipt {
  orderId: string;
  /** ISO string tanggal transaksi */
  date: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  method: CheckoutMethod;
  tendered?: number;
  change?: number;
}

interface CheckoutState {
  paymentMethod: CheckoutMethod;
  tendered: number | null;
  orderId: string | null;
  /** Snapshot data receipt setelah pembayaran sukses (dibaca success screen) */
  receipt: CheckoutReceipt | null;

  setPaymentMethod: (method: CheckoutMethod) => void;
  setTendered: (amount: number | null) => void;
  setOrderId: (orderId: string) => void;
  setReceipt: (receipt: CheckoutReceipt) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  paymentMethod: "cash",
  tendered: null,
  orderId: null,
  receipt: null,

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setTendered: (tendered) => set({ tendered }),
  setOrderId: (orderId) => set({ orderId }),
  setReceipt: (receipt) => set({ receipt }),
  reset: () => set({ paymentMethod: "cash", tendered: null, orderId: null, receipt: null }),
}));
