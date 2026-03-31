import { cn, getInitials } from '../../utils/helpers';

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const colors = [
  'bg-primary-500',
  'bg-success-500',
  'bg-warning-500',
  'bg-danger-500',
  'bg-purple-500',
  'bg-teal-500',
  'bg-pink-500',
  'bg-cyan-500',
];

/**
 * Avatar component with image fallback to initials
 */
const Avatar = ({ src, name, size = 'md', className }) => {
  const colorIndex = (name || '').charCodeAt(0) % colors.length;

  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center font-semibold text-white overflow-hidden shrink-0',
        sizes[size],
        !src && colors[colorIndex],
        className
      )}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

/**
 * Stacked avatar group
 */
export const AvatarGroup = ({ users = [], max = 3, size = 'sm' }) => {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar
          key={user._id || i}
          src={user.avatar?.url}
          name={user.name}
          size={size}
          className="ring-2 ring-white dark:ring-surface-800"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full flex items-center justify-center bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-300 font-medium ring-2 ring-white dark:ring-surface-800',
            sizes[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default Avatar;
