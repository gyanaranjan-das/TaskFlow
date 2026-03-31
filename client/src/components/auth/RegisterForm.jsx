import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useRegister } from '../../hooks/useAuth';
import { toast } from '../ui/Toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'At least one uppercase letter')
    .regex(/[0-9]/, 'At least one number'),
});

/**
 * Register form with validation
 */
const RegisterForm = () => {
  const registerMutation = useRegister();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setSuccess(true);
        toast.success('Account created! Check your email to verify.');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Registration failed');
      },
    });
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-success-500">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
          Check your email
        </h3>
        <p className="text-surface-500 dark:text-surface-400">
          We've sent a verification link to your email address. Please click it to activate your account.
        </p>
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-500 font-medium text-sm"
        >
          Back to login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Input
        id="register-name"
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        id="register-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="register-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={registerMutation.isPending}
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
          Sign in
        </Link>
      </p>
    </motion.form>
  );
};

export default RegisterForm;
