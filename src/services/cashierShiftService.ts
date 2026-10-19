/**
 * cashierShiftService.ts
 * GET /api/cashier-shifts dan /api/cashier-shifts/status
 */

import { api } from "./api";

export interface CashierShift {
  id: string;
  company_id: string;
  outlet_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: string;
  opening_cash: number;
  closing_cash: number;
  expected_cash: number;
  created_at: string;
  updated_at: string;
}

export interface FindAllCashierShiftsOutput {
  shifts: CashierShift[];
  has_more: boolean;
  next_cursor: string;
}

export function fetchCashierShifts(): Promise<FindAllCashierShiftsOutput> {
  return api
    .get<FindAllCashierShiftsOutput>("/api/cashier-shifts")
    .then((r) => r.data);
}

export function fetchCashierShiftStatus(): Promise<CashierShift> {
  return api
    .get<CashierShift>("/api/cashier-shifts/status")
    .then((r) => r.data);
}

/** POST /api/cashier-shifts/start */
export function startCashierShift(outletId: string, openingCash: number): Promise<CashierShift> {
  return api
    .post<CashierShift>("/api/cashier-shifts/start", {
      outlet_id: outletId,
      opening_cash: openingCash,
      status: "active",
    })
    .then((r) => r.data);
}

/** POST /api/cashier-shifts/end */
export function endCashierShift(closingCash?: number): Promise<CashierShift> {
  return api
    .post<CashierShift>("/api/cashier-shifts/end", {
      status: "closed",
      closing_cash: closingCash ?? 0,
    })
    .then((r) => r.data);
}
