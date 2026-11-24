/** Diskon tingkat produk dari backend (/api/products/mobile). */
export interface ProductDiscount {
  id: string;
  name: string;
  /** "product_rp" = nominal rupiah, "product_pct" = persen */
  type: string;
  /** Nilai diskon: rupiah untuk product_rp, persen untuk product_pct */
  discount_value: number;
  priority: number;
  is_active: boolean;
  created_at?: string;
}

export interface DiscountLine {
  name: string;
  /** Nominal diskon (rupiah) yang dihasilkan langkah ini */
  amount: number;
}

/**
 * Urutkan diskon: priority kecil lebih dulu; bila priority sama,
 * created_at lebih lama (lebih kecil) lebih dulu.
 */
export function sortProductDiscounts<T extends {
  priority?: number;
  created_at?: string;
}>(discounts: T[]): T[] {
  return [...discounts].sort((a, b) => {
    const pa = a.priority ?? Number.MAX_SAFE_INTEGER;
    const pb = b.priority ?? Number.MAX_SAFE_INTEGER;
    if (pa !== pb) return pa - pb;
    const ta = a.created_at ? Date.parse(a.created_at) : Number.MAX_SAFE_INTEGER;
    const tb = b.created_at ? Date.parse(b.created_at) : Number.MAX_SAFE_INTEGER;
    if (ta !== tb) return ta - tb;
    return 0;
  });
}

/**
 * Terapkan diskon produk secara berurutan terhadap harga saat ini.
 * - product_rp  : potongan nominal langsung
 * - product_pct : potongan persen dari harga berjalan
 * Diskon tidak aktif dan harga non-finite diabaikan. Hasil tidak pernah negatif.
 */
export function applyProductDiscounts(
  basePrice: number,
  discounts: ProductDiscount[] | undefined,
): { finalPrice: number; totalDiscount: number; lines: DiscountLine[] } {
  if (!Number.isFinite(basePrice) || basePrice <= 0 || !discounts?.length) {
    return { finalPrice: basePrice, totalDiscount: 0, lines: [] };
  }

  let price = basePrice;
  let totalDiscount = 0;
  const lines: DiscountLine[] = [];

  for (const discount of sortProductDiscounts(discounts)) {
    if (discount.is_active === false) continue;

    let amount = 0;
    if (discount.type === "product_rp") {
      amount = discount.discount_value;
    } else if (discount.type === "product_pct") {
      amount = (price * discount.discount_value) / 100;
    } else {
      continue;
    }

    amount = Math.min(Math.max(amount, 0), price);
    if (amount <= 0) continue;

    price -= amount;
    totalDiscount += amount;
    lines.push({ name: discount.name, amount });
  }

  return { finalPrice: price, totalDiscount, lines };
}

/** Harga jual final sebuah produk setelah seluruh diskon produknya. */
export function discountedPrice(
  product: { price: number; discounts?: ProductDiscount[] },
): number {
  return applyProductDiscounts(product.price, product.discounts).finalPrice;
}
