import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { secureStateStorage } from './persistStorage';

/** Sesuai models.User dari backend (response /api/auth/login-mobile & /api/auth/access) */
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  company_id?: string | null;
  role: string;
  active: boolean;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  hasHydrated: boolean;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'pos-auth-storage',
      storage: createJSONStorage(() => secureStateStorage),
      partialize: (state) => ({ user: state.user }) as AuthState,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
