export interface User {
  id: string;
  username: string;
  email: string;
  pos_pin: string;
  company_id: string;
  role: "admin" | "owner" | "employee" | string;
  active: boolean;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPayload {
  user: User;
}

/** Sesuai models.UserAccess dari backend (GET /api/auth/access) */
export interface UserAccess {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  company_id?: string | null;
  role: string;
  active: boolean;
  is_owner: boolean;
  permissions: string[];
  created_at: string;
  updated_at: string;
}
