import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginForm from '../components/auth/LoginForm';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * Login page
 */
const Login = () => {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100 dark:from-surface-950 dark:via-surface-900 dark:to-primary-950 p-4"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <svg viewBox="0 0 32 32" className="w-7 h-7 text-white">
              <path d="M9 16.5L13.5 21L23 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-surface-900 dark:text-white">TaskFlow</span>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 p-8">
          <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">Sign in to your account</p>
          <LoginForm />
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
