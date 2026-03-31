import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUIStore } from '../../store/uiStore';

/**
 * Main application layout with sidebar + header + content
 */
const AppLayout = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 256 : 72 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="min-h-screen flex flex-col"
      >
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default AppLayout;
