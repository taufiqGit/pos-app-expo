export type ProductUnit = {
  id: string;
  product_id?: string;
  /** Relasi ke master units (untuk symbol) */
  unit_id: string;
  unit_symbol?: string;
  label: string;
  /** Konversi ke base unit, harus > 0 (mis. "Sak 50kg" = 50) */
  conversion_factor: number;
  /** Harga fix per satuan ini; null → pakai price × conversion_factor */
  price_override?: number | null;
  is_default?: boolean;
  /** true → input qty desimal (timbangan) */
  is_weighable?: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category?: string;
  /** Deskripsi singkat, tampil sebagai subtitle di ProductCard */
  subtitle?: string;
  /** Diskon dalam persen (mis. 30 → badge "-30%") */
  discount?: number;
  sku?: string;
  barcode?: string;
  stock?: number;
  image?: string;
  taxRate?: number;
  /** Base unit produk (satuan dasar stok & harga) */
  baseUnit?: string;
  baseUnitId?: string;
  /** Satuan kemasan alternatif, dipakai beli & jual */
  productUnits?: ProductUnit[];
};

/** Harga jual final untuk sebuah satuan: override ?? product.price × factor. Unit kosong = base unit. */
export function resolveUnitPrice(product: Pick<Product, 'price'>, unit?: ProductUnit): number {
  if (!unit) return product.price;
  return unit.price_override ?? product.price * unit.conversion_factor;
}

/** Qty dalam base unit (untuk preview stok; backend selalu hitung ulang sendiri). */
export function toBaseQty(quantity: number, unit?: ProductUnit): number {
  return quantity * (unit?.conversion_factor ?? 1);
}
