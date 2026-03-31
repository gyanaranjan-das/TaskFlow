import { create } from 'zustand';

/**
 * Auth store - manages user state and access token (in-memory only)
 * Access token is NOT persisted for security
 */
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('taskflow_user') || 'null'),
  accessToken: null,
  isLoading: true,

  setToken: (token) => set({ accessToken: token }),

  login: (user, accessToken) => {
    localStorage.setItem('taskflow_user', JSON.stringify(user));
    set({ user, accessToken, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('taskflow_user');
    set({ user: null, accessToken: null, isLoading: false });
  },

  updateUser: (userData) => {
    set((state) => {
      const updated = { ...state.user, ...userData };
      localStorage.setItem('taskflow_user', JSON.stringify(updated));
      return { user: updated };
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
