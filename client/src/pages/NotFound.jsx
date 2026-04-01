import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold text-primary-500">404</h1>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Page Not Found</h2>
        <p className="text-surface-500 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button className="gap-2">
            <Home className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
