/**
 * salesService.ts
 * POST /api/sales sesuai kontrak backend (SaleInput):
 * per baris kirim product_id + product_unit_id (opsional) + quantity (desimal,
 * dalam satuan terpilih) + unit_price. base_quantity dihitung ulang server-side.
 */

import { api } from "./api";
import { CartItem } from "../types/cart";

export type SalePaymentMethod = "cash" | "debit_card" | "credit_card" | "qris" | "transfer";

export interface CreateSalePayload {
  outlet_id: string;
  payment_method: SalePaymentMethod;
  discount_bill: number;
  tax_rate: number;
  paid_amount: number;
  details: {
    product_id: string;
    product_unit_id?: string | null;
    quantity: number;
    unit_price: number;
  }[];
}

export interface SaleResponse {
  id: string;
  grand_total: number;
  paid_amount: number;
  change_amount: number;
  status: string;
  created_at: string;
}

/** Mapping CheckoutMethod mobile → PaymentMethodType backend */
const METHOD_MAP: Record<string, SalePaymentMethod> = {
  cash: "cash",
  card: "debit_card",
  ewallet: "qris",
};

export function buildSalePayload(
  outletId: string,
  method: string,
  paidAmount: number,
  items: CartItem[],
): CreateSalePayload {
  return {
    outlet_id: outletId,
    payment_method: METHOD_MAP[method] ?? "cash",
    discount_bill: 0,
    tax_rate: 0,
    paid_amount: paidAmount,
    details: items.map((item) => ({
      product_id: item.productId,
      product_unit_id: item.productUnitId ?? null,
      quantity: Math.round(item.quantity * 1000) / 1000,
      unit_price: item.price,
    })),
  };
}

export interface Sale {
  id: string;
  outlet_id: string;
  outlet_name?: string;
  user_id: string;
  user_name?: string;
  payment_method: SalePaymentMethod | string;
  status: "pending" | "completed" | "cancelled" | "refunded" | string;
  sub_total: number;
  discount_bill: number;
  grand_total: number;
  paid_amount: number;
  change_amount: number;
  created_at: string;
}

export interface ListSalesResponse {
  data: Sale[];
}

/** GET /api/sales — daftar transaksi (paginated) */
export async function fetchSales(page = 1, limit = 50): Promise<Sale[]> {
  const response = await api.get<ListSalesResponse>("/api/sales", {
    params: { page, limit },
  });
  return response.data?.data ?? [];
}

/** GET /api/sales/{id} — detail transaksi */
export async function fetchSaleById(id: string): Promise<Sale> {
  const response = await api.get<Sale>(`/api/sales/${id}`);
  return response.data;
}

export async function createSale(payload: CreateSalePayload): Promise<SaleResponse> {
  const response = await api.post<SaleResponse>("/api/sales", payload);
  return response.data;
}
