import { useCallback } from "react";
import { useCartStore } from "../store/cartStore";
import { CartItem, Product } from "../types";

export const useCart = () => {
  const {
    items,
    discountAmount,
    discountType,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDiscount,
  } = useCartStore();

  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  );

  const discountTotal =
    discountType === "percent"
      ? (subtotal * discountAmount) / 100
      : discountAmount;

  const taxAmount = items.reduce(
    (sum: number, item: CartItem) =>
      sum + item.price * item.quantity * ((item.tax ?? 0) / 100),
    0,
  );

  const total = subtotal - discountTotal + taxAmount;

  const itemCount = items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0,
  );

  const addProduct = useCallback(
    (product: Product, quantity = 1) => {
      addItem(product, quantity);
    },
    [addItem],
  );

  const incrementItem = useCallback(
    (productId: string) => {
      const item = items.find((i: CartItem) => i.id === productId);
      if (item) updateQuantity(productId, item.quantity + 1);
    },
    [items, updateQuantity],
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
    [items, removeItem, updateQuantity],
  );

  const isInCart = useCallback(
    (productId: string) => items.some((i: CartItem) => i.id === productId),
    [items],
  );

  const getItemQuantity = useCallback(
    (productId: string): number =>
      items.find((i: CartItem) => i.id === productId)?.quantity ?? 0,
    [items],
  );

  return {
    // State
    items,
    discount: { type: discountType, value: discountAmount },
    itemCount,
    isEmpty: items.length === 0,

    // Totals
    subtotal,
    discountAmount: discountTotal,
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
