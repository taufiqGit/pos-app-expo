import { useCallback } from 'react';
import { useCartStore } from '../store/cartStore';
import { CartItem, Product } from '../types';

export const useCart = () => {
  const {
    items,
    discount,
    taxRate,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDiscount,
  } = useCartStore();

  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = discount?.type === 'percent'
    ? (subtotal * discount.value) / 100
    : (discount?.value ?? 0);

  const taxAmount = ((subtotal - discountAmount) * taxRate) / 100;
  const total = subtotal - discountAmount + taxAmount;

  const itemCount = items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  const addProduct = useCallback(
    (product: Product, quantity = 1) => {
      addItem({ ...product, quantity });
    },
    [addItem]
  );

  const incrementItem = useCallback(
    (productId: string) => {
      const item = items.find((i: CartItem) => i.id === productId);
      if (item) updateQuantity(productId, item.quantity + 1);
    },
    [items, updateQuantity]
  );

  const decrementItem = useCallback(
    (productId: string) => {
      const item = items.find((i: CartItem) => i.id === productId);
      if (!item) return;
      if (item.quantity <= 1) {
        removeItem(productId);
      } else {
        updateQuantity(productId, item.quantity - 1);
      }
    },
    [items, removeItem, updateQuantity]
  );

  const isInCart = useCallback(
    (productId: string) => items.some((i: CartItem) => i.id === productId),
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: string): number =>
      items.find((i: CartItem) => i.id === productId)?.quantity ?? 0,
    [items]
  );

  return {
    // State
    items,
    discount,
    taxRate,
    itemCount,
    isEmpty: items.length === 0,

    // Totals
    subtotal,
    discountAmount,
    taxAmount,
    total,

    // Actions
    addProduct,
    removeItem,
    incrementItem,
    decrementItem,
    updateQuantity,
    clearCart,
    setDiscount,

    // Helpers
    isInCart,
    getItemQuantity,
  };
};
