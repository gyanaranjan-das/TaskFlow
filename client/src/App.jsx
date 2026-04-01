import AppRouter from './router';
import ToastContainer from './components/ui/Toast';
import TaskDetailDrawer from './components/tasks/TaskDetailDrawer';
import CreateTaskModal from './components/tasks/CreateTaskModal';
import BulkActions from './components/tasks/BulkActions';
import { useAuthInit } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';

/**
 * Root App component
 * Sets up auth initialization, theme, toast, and global overlays
 */
const App = () => {
  // Initialize auth state (attempt token refresh on mount)
  useAuthInit();

  // Apply theme (dark mode class on html)
  useTheme();

  return (
    <>
      <AppRouter />
      <TaskDetailDrawer />
      <CreateTaskModal />
      <BulkActions />
      <ToastContainer />
    </>
  );
};

export default App;
