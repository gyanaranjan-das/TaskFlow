import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as usersApi from '../api/users';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/shared/ThemeToggle';
import { toast } from '../components/ui/Toast';
import { Camera } from 'lucide-react';
import { useRef } from 'react';

const profileSchema = z.object({
  name: z.string().min(2).max(100),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef(null);

  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name } });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const updateMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (data) => { updateUser(data.data.user); toast.success('Profile updated!'); },
    onError: () => toast.error('Update failed'),
  });

  const passwordMutation = useMutation({
    mutationFn: usersApi.changePassword,
    onSuccess: () => { toast.success('Password changed!'); passwordForm.reset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const avatarMutation = useMutation({
    mutationFn: usersApi.uploadAvatar,
    onSuccess: (data) => { updateUser({ avatar: data.data.avatar }); toast.success('Avatar updated!'); },
    onError: () => toast.error('Upload failed'),
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) avatarMutation.mutate(file);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Profile</h1>

      {/* Avatar Section */}
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar src={user?.avatar?.url} name={user?.name} size="lg" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">{user?.name}</h2>
            <p className="text-surface-500">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Account Details</h3>
        <form onSubmit={profileForm.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
          <Input id="pf-name" label="Name" error={profileForm.formState.errors.name?.message} {...profileForm.register('name')} />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Theme</label>
              <ThemeToggle />
            </div>
          </div>
          <Button type="submit" isLoading={updateMutation.isPending}>Save Changes</Button>
        </form>
      </Card>

      {/* Change Password */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Change Password</h3>
        <form onSubmit={passwordForm.handleSubmit((d) => passwordMutation.mutate(d))} className="space-y-4">
          <Input id="pf-curr" label="Current Password" type="password" error={passwordForm.formState.errors.currentPassword?.message} {...passwordForm.register('currentPassword')} />
          <Input id="pf-new" label="New Password" type="password" error={passwordForm.formState.errors.newPassword?.message} {...passwordForm.register('newPassword')} />
          <Button type="submit" isLoading={passwordMutation.isPending}>Change Password</Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default Profile;
