/**
 * services/outletService.ts
 * Outlet service for listing outlets.
 */

import { api } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Outlet {
  id: string;
  company_id?: string;
  code: string;
  name: string;
  supervisor: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetOutletsParams {
  page?: number;
  limit?: number;
}

export interface OutletListResponse {
  data: Outlet[];
  message: string;
  success: boolean;
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export async function getOutlets(
  params: GetOutletsParams = {},
): Promise<OutletListResponse> {
  return api.get<Outlet[]>("/api/outlets", { params });
}

export const outletService = {
  getOutlets,
};

export default outletService;
