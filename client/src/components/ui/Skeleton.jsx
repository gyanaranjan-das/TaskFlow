import { cn } from '../../utils/helpers';

/**
 * Skeleton loading placeholders with shimmer animation
 */
const Skeleton = ({ className, ...props }) => {
  return <div className={cn('skeleton', className)} {...props} />;
};

/**
 * Pre-built skeleton for a task card
 */
export const TaskCardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
    <Skeleton className="h-5 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="flex items-center justify-between pt-2">
      <div className="flex -space-x-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  </div>
);

/**
 * Pre-built skeleton for dashboard stat card
 */
export const StatCardSkeleton = () => (
  <div className="card p-6 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="h-8 w-20" />
    <Skeleton className="h-4 w-32" />
  </div>
);

/**
 * Pre-built skeleton for kanban column
 */
export const KanbanColumnSkeleton = () => (
  <div className="w-72 shrink-0 space-y-3">
    <div className="flex items-center gap-2 px-1">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-5 w-6 rounded-full" />
    </div>
    <div className="space-y-3">
      <TaskCardSkeleton />
      <TaskCardSkeleton />
      <TaskCardSkeleton />
    </div>
  </div>
);

export default Skeleton;
