import { useState, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'cashier' | 'manager';
  pin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const login = useCallback(async (pin: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // TODO: Replace with real authentication logic / API call
      if (pin === '1234') {
        const mockUser: User = {
          id: '1',
          name: 'Demo User',
          role: 'cashier',
        };
        setState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        throw new Error('Invalid PIN. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
        isAuthenticated: false,
        user: null,
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const hasRole = useCallback(
    (role: User['role']) => {
      return state.user?.role === role;
    },
    [state.user]
  );

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    clearError,
    hasRole,
  };
}
