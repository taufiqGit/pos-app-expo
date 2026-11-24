/**
 * modifierService.ts
 * GET /api/modifier-groups/product/{id} — modifier groups (beserta opsi)
 * yang menempel pada sebuah produk, untuk popup pemilihan di POS.
 */

import { api } from "./api";

export interface ModifierOption {
  id: string;
  name: string;
  modifier_group_id: string;
  price: number;
  is_active: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  min_select: number;
  max_select: number;
  is_required: boolean;
  is_active: boolean;
  options: ModifierOption[];
}

/** Modifier yang dipilih user untuk satu baris cart. */
export interface SelectedModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export async function fetchProductModifierGroups(
  productId: string,
): Promise<ModifierGroup[]> {
  const response = await api.get<ModifierGroup[]>(
    `/api/modifier-groups/product/${productId}`,
  );
  return (response.data ?? []).filter((group) => group.is_active);
}
