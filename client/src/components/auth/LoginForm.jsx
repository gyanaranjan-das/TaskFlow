import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useLogin } from '../../hooks/useAuth';
import { toast } from '../ui/Toast';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Login form with validation
 */
const LoginForm = () => {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data, {
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Login failed');
      },
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Input
        id="login-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="login-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
          <input type="checkbox" className="rounded border-surface-300 text-primary-500 focus:ring-primary-500" />
          Remember me
        </label>
        <Link
          to="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={loginMutation.isPending}
      >
        Sign In
      </Button>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
          Create account
        </Link>
      </p>
    </motion.form>
  );
};

export default LoginForm;
