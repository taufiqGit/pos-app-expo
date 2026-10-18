export interface CartItem {
  /** Composite id: `${productId}:${productUnitId ?? "base"}` — item beda satuan tidak di-merge */
  id: string;
  productId: string;
  name: string;
  /** Snapshot harga per satuan terpilih (resolveUnitPrice saat masuk cart) */
  price: number;
  quantity: number;
  /** null/undefined = base unit produk */
  productUnitId?: string | null;
  /** Label satuan untuk tampilan (mis. "Sak 50kg"); kosong = base unit */
  unitLabel?: string;
  /** Qty dalam base unit (quantity × conversion_factor) — hanya preview UI */
  baseQty?: number;
  image?: string;
  sku?: string;
  tax?: number;
  discount?: number;
}
