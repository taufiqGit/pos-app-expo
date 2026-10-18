import { create } from 'zustand';
import { CartItem } from '../types/cart';

/** Composite id: beda satuan = baris cart berbeda, tidak di-merge */
export function cartLineId(productId: string, productUnitId?: string | null): string {
  return `${productId}:${productUnitId ?? 'base'}`;
}

interface CartState {
  items: CartItem[];
  note: string;
  discountAmount: number;
  discountType: 'fixed' | 'percent';

  // Computed
  subtotal: () => number;
  taxTotal: () => number;
  discountTotal: () => number;
  grandTotal: () => number;
  /** Jumlah baris (bukan total qty) — ringkas utk multi-satuan */
  itemCount: () => number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setNote: (note: string) => void;
  setDiscount: (amount: number, type: 'fixed' | 'percent') => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  note: '',
  discountAmount: 0,
  discountType: 'fixed',

  // Computed values
  subtotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },

  taxTotal: () => {
    return get().items.reduce((sum, item) => {
      const itemSubtotal = item.price * item.quantity;
      const taxRate = item.tax ?? 0;
      return sum + itemSubtotal * (taxRate / 100);
    }, 0);
  },

  discountTotal: () => {
    const { discountAmount, discountType } = get();
    const subtotal = get().subtotal();
    if (discountType === 'percent') {
      return subtotal * (discountAmount / 100);
    }
    return discountAmount;
  },

  grandTotal: () => {
    return get().subtotal() + get().taxTotal() - get().discountTotal();
  },

  itemCount: () => {
    return get().items.length;
  },

  // Actions
  addItem: (newItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === newItem.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === newItem.id
              ? { ...i, quantity: i.quantity + newItem.quantity, baseQty: (i.baseQty ?? i.quantity) + (newItem.baseQty ?? newItem.quantity) }
              : i
          ),
        };
      }
      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => {
        if (i.id !== id) return i;
        // Skala ulang baseQty proporsional dengan perubahan qty
        const factor = i.baseQty !== undefined && i.quantity > 0 ? i.baseQty / i.quantity : undefined;
        return {
          ...i,
          quantity,
          baseQty: factor !== undefined ? Math.round(factor * quantity * 1000) / 1000 : undefined,
        };
      }),
    }));
  },

  clearCart: () => {
    set({ items: [], note: '', discountAmount: 0, discountType: 'fixed' });
  },

  setNote: (note) => {
    set({ note });
  },

  setDiscount: (amount, type) => {
    set({ discountAmount: amount, discountType: type });
  },
}));
