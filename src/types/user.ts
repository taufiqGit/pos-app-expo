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
