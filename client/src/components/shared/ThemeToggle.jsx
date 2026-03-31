import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/helpers';

/**
 * Theme toggle component
 */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-100 dark:bg-surface-800">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={cn(
              'p-1.5 rounded-md transition-all duration-200',
              active
                ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600 dark:text-primary-400'
                : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
            )}
            title={opt.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
