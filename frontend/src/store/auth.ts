import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  
  // API Actions
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  password_confirm: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/accounts/token/', { email, password });
          const { access, refresh } = response.data;
          
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          
          // Fetch user profile
          await get().fetchProfile();
          
          return { success: true, message: 'Login successful!' };
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Login failed';
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          await api.post('/accounts/register/', data);
          
          // Auto login after registration
          const loginResult = await get().login(data.email, data.password);
          return loginResult;
        } catch (error: any) {
          const message = error.response?.data?.email?.[0] || 
                         error.response?.data?.password?.[0] || 
                         'Registration failed';
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        try {
          const response = await api.get('/accounts/profile/');
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.patch('/accounts/profile/', data);
          set({ user: response.data });
          return { success: true, message: 'Profile updated!' };
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Update failed';
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'mobiplan-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
