import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: 'online' | 'offline';
  about: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({
    user: null,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
    updateUser: (updates) => set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    })),
    initializeAuth: () => {
      // Auth is automatically loaded from localStorage by persist middleware
    }
  }),
  {
    name: 'whatsapp-auth'
  }
));