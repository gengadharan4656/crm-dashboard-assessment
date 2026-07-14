import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  remember: boolean;
  login: (user: User, remember: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      remember: false,
      login: (user, remember) => set({ user, isAuthenticated: true, remember }),
      logout: () => set({ user: null, isAuthenticated: false, remember: false }),
    }),
    {
      name: 'nimbus-auth',
      partialize: (s) => ({ user: s.remember ? s.user : null, isAuthenticated: s.remember ? s.isAuthenticated : false, remember: s.remember }),
    }
  )
);
