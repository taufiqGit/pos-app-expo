import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
  tax?: number;
  discount?: number;
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
  itemCount: () => number;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
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
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Actions
  addItem: (newItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === newItem.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...newItem, quantity: 1 }] };
    });
  },

  removeItem: (id) => {
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
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      ),
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
