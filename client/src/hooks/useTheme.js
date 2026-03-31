import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

/**
 * Hook to manage dark mode theme
 * Applies 'dark' class to html element based on preference
 */
export function useTheme() {
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (t) => {
      if (t === 'dark') {
        root.classList.add('dark');
      } else if (t === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(theme);

    // Listen for system theme changes
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  return { theme, setTheme };
}
