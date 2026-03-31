import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, FolderKanban, User, ChevronLeft, ChevronRight, Plus,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/helpers';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/profile', label: 'Profile', icon: User },
];

/**
 * Sidebar navigation component
 */
const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, openCreateModal } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 z-30 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200 dark:border-surface-800">
        <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 32 32" className="w-5 h-5 text-white">
            <path d="M9 16.5L13.5 21L23 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg text-surface-900 dark:text-white whitespace-nowrap overflow-hidden"
            >
              TaskFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Create */}
      <div className="px-3 py-4">
        <button
          onClick={openCreateModal}
          className={cn(
            'flex items-center gap-2 w-full py-2.5 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors',
            sidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center'
          )}
        >
          <Plus className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                New Task
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  sidebarOpen ? 'px-4' : 'px-0 justify-center',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                )
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-4 border-t border-surface-200 dark:border-surface-800">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2 w-full py-2 rounded-xl text-sm text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors',
            sidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center'
          )}
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
