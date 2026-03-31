import { useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as authApi from '../api/auth';

/**
 * Hook to initialize auth state on app mount
 * Attempts to refresh the access token using the httpOnly cookie
 */
export function useAuthInit() {
  const { user, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.refreshToken();
        setToken(data.data.accessToken);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Login mutation hook
 */
export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: authApi.loginUser,
    onSuccess: (data) => {
      login(data.data.user, data.data.accessToken);
    },
  });
}

/**
 * Register mutation hook
 */
export function useRegister() {
  return useMutation({
    mutationFn: authApi.registerUser,
  });
}

/**
 * Logout hook
 */
export function useLogout() {
  const { logout } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: authApi.logoutUser,
    onSettled: () => {
      logout();
    },
  });

  return useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);
}

/**
 * Forgot password mutation
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
}

/**
 * Reset password mutation
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }) => authApi.resetPassword(token, password),
  });
}

/**
 * Verify email mutation
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
  });
}
