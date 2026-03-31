import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useForgotPassword } from '../../hooks/useAuth';
import { toast } from '../../components/ui/Toast';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

const ForgotPassword = () => {
  const mutation = useForgotPassword();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    mutation.mutate(data.email, {
      onSuccess: () => { setSent(true); toast.success('Reset link sent!'); },
      onError: () => toast.error('Something went wrong'),
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100 dark:from-surface-950 dark:via-surface-900 dark:to-primary-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 p-8">
        <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Forgot Password</h1>
        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-surface-500">Check your email for a reset link.</p>
            <Link to="/login" className="text-primary-600 font-medium text-sm">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-surface-500 text-sm mb-4">Enter your email and we"ll send you a reset link.</p>
            <Input id="fp-email" label="Email" type="email" error={errors.email?.message} {...register('email')} />
            <Button type="submit" className="w-full" isLoading={mutation.isPending}>Send Reset Link</Button>
            <p className="text-center text-sm"><Link to="/login" className="text-primary-600 font-medium">Back to login</Link></p>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
