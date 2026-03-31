import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useResetPassword } from '../../hooks/useAuth';
import { toast } from '../../components/ui/Toast';
import { useState } from 'react';

const schema = z.object({
  password: z.string().min(8).regex(/[A-Z]/, 'Need uppercase').regex(/[0-9]/, 'Need number'),
});

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const mutation = useResetPassword();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    mutation.mutate({ token, password: data.password }, {
      onSuccess: () => { setDone(true); toast.success('Password reset!'); },
      onError: (e) => toast.error(e.response?.data?.message || 'Reset failed'),
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100 dark:from-surface-950 dark:via-surface-900 dark:to-primary-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 p-8">
        <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Reset Password</h1>
        {done ? (
          <div className="text-center space-y-4">
            <p className="text-surface-500">Password reset successfully!</p>
            <Link to="/login" className="text-primary-600 font-medium">Sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input id="rp-password" label="New Password" type="password" error={errors.password?.message} {...register('password')} />
            <Button type="submit" className="w-full" isLoading={mutation.isPending}>Reset Password</Button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ResetPassword;
