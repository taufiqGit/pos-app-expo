/**
 * categoryService.ts
 * GET /api/categories (kategori milik company user).
 */

import { api } from "./api";

export interface Category {
  id: string;
  company_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export function fetchCategories(): Promise<Category[]> {
  return api
    .get<Category[]>("/api/categories", { params: { limit: 100 } })
    .then((r) => r.data ?? []);
}
