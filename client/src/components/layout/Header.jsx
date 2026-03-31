import { Search, Bell } from 'lucide-react';
import Avatar from '../ui/Avatar';
import ThemeToggle from '../shared/ThemeToggle';
import DropdownMenu, { DropdownItem } from '../ui/DropdownMenu';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';

/**
 * Top header bar with search, notifications, and user menu
 */
const Header = () => {
  const { user } = useAuthStore();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="input-field pl-10 bg-surface-50 dark:bg-surface-800 border-transparent focus:border-primary-500"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500" />
        </button>

        {/* User Menu */}
        <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
              <Avatar
                src={user?.avatar?.url}
                name={user?.name}
                size="sm"
              />
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300 hidden sm:block">
                {user?.name}
              </span>
            </button>
          }
        >
          <div className="px-3 py-2 border-b border-surface-100 dark:border-surface-700">
            <p className="text-sm font-medium text-surface-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-surface-500">{user?.email}</p>
          </div>
          <DropdownItem onClick={() => navigate('/profile')}>
            <User className="w-4 h-4" /> Profile
          </DropdownItem>
          <DropdownItem onClick={logout} danger>
            <LogOut className="w-4 h-4" /> Sign Out
          </DropdownItem>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
