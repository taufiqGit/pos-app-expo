import { useCallback } from "react";
import { useCartStore, cartLineId } from "../store/cartStore";
import { CartItem, Product, ProductUnit, resolveUnitPrice, toBaseQty } from "../types";

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

  /** Jumlah baris (beda satuan = baris beda) */
  const itemCount = items.length;

  const addProduct = useCallback(
    (product: Product, unit?: ProductUnit, quantity = 1) => {
      const price = resolveUnitPrice(product, unit);
      addItem({
        id: cartLineId(product.id, unit?.id),
        productId: product.id,
        name: product.name,
        price,
        quantity,
        productUnitId: unit?.id ?? null,
        unitLabel: unit?.label,
        baseQty: toBaseQty(quantity, unit),
        image: product.image,
        sku: product.sku,
        tax: product.taxRate,
      });
    },
    [addItem],
  );

  const incrementItem = useCallback(
    (lineId: string) => {
      const item = items.find((i: CartItem) => i.id === lineId);
      if (item) updateQuantity(lineId, item.quantity + 1);
    },
    [items, updateQuantity],
  );

  const decrementItem = useCallback(
    (lineId: string) => {
      const item = items.find((i: CartItem) => i.id === lineId);
      if (!item) return;
      if (item.quantity <= 1) {
        removeItem(lineId);
      } else {
        updateQuantity(lineId, item.quantity - 1);
      }
    },
    [items, removeItem, updateQuantity],
  );

  const isInCart = useCallback(
    (productId: string) => items.some((i: CartItem) => i.productId === productId),
    [items],
  );

  const getItemQuantity = useCallback(
    (productId: string): number =>
      items
        .filter((i: CartItem) => i.productId === productId)
        .reduce((sum: number, i: CartItem) => sum + i.quantity, 0),
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
