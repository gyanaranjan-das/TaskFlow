import { motion } from 'framer-motion';
import RegisterForm from '../../components/auth/RegisterForm';

/**
 * Register page
 */
const Register = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100 dark:from-surface-950 dark:via-surface-900 dark:to-primary-950 p-4"
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <svg viewBox="0 0 32 32" className="w-7 h-7 text-white">
              <path d="M9 16.5L13.5 21L23 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-surface-900 dark:text-white">TaskFlow</span>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 p-8">
          <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-1">Create your account</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">Start managing your tasks today</p>
          <RegisterForm />
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
