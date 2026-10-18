/**
 * productService.ts
 * Fetch produk dari /api/products/mobile (endpoint khusus kasir mobile).
 */

import { api } from "./api";
import { Product, ProductUnit } from "../types";

/** Bentuk respons ProductList dari backend */
interface MobileProductPayload {
  id: string;
  name: string;
  sku: string;
  product_code: string;
  unit: string;
  unit_id: string;
  cost: number;
  price: number;
  image_url: string;
  category: string;
  product_units?: ProductUnit[];
}

function mapProduct(payload: MobileProductPayload): Product {
  return {
    id: payload.id,
    name: payload.name,
    price: payload.price,
    sku: payload.sku,
    baseUnit: payload.unit,
    baseUnitId: payload.unit_id,
    category: payload.category || undefined,
    image: payload.image_url || undefined,
    productUnits: payload.product_units ?? [],
  };
}

export async function fetchMobileProducts(): Promise<Product[]> {
  const response = await api.get<MobileProductPayload[]>("/api/products/mobile");
  return (response.data ?? []).map(mapProduct);
}
