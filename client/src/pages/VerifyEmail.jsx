import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { useVerifyEmail } from '../../hooks/useAuth';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const mutation = useVerifyEmail();

  useEffect(() => {
    if (token) mutation.mutate(token);
  }, [token]); // eslint-disable-line

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100 dark:from-surface-950 dark:via-surface-900 dark:to-primary-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 p-8 text-center">
        {mutation.isPending && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-primary-500 animate-spin" />
            <p className="text-surface-500">Verifying your email...</p>
          </div>
        )}
        {mutation.isSuccess && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-success-500" />
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">Email Verified!</h2>
            <p className="text-surface-500">Your account has been verified. You can now sign in.</p>
            <Link to="/login" className="btn-primary inline-flex">Sign In</Link>
          </div>
        )}
        {mutation.isError && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 mx-auto text-danger-500" />
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">Verification Failed</h2>
            <p className="text-surface-500">{mutation.error?.response?.data?.message || 'Invalid or expired token.'}</p>
            <Link to="/login" className="text-primary-600 font-medium">Back to login</Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
