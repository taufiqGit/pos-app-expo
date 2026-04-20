import { create } from 'zustand';

export type UserRole = 'admin' | 'cashier' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pin?: string;
}

export interface AuthState {
  user: User | null;
  role: UserRole | null;
  session: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithPin: (pin: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setSession: (session: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with real API call
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        role: 'cashier',
      };
      const mockSession = 'mock-session-token';
      set({
        user: mockUser,
        role: mockUser.role,
        session: mockSession,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message ?? 'Login failed' });
    }
  },

  loginWithPin: async (pin: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with real PIN validation
      if (pin.length < 4) {
        throw new Error('Invalid PIN');
      }
      const mockUser: User = {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@pos.com',
        role: 'admin',
        pin,
      };
      const mockSession = 'mock-pin-session-token';
      set({
        user: mockUser,
        role: mockUser.role,
        session: mockSession,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message ?? 'PIN login failed' });
    }
  },

  logout: () => {
    set({
      user: null,
      role: null,
      session: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setUser: (user: User) => {
    set({ user, role: user.role });
  },

  setSession: (session: string) => {
    set({ session });
  },

  clearError: () => {
    set({ error: null });
  },
}));
