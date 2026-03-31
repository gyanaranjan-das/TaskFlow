import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTaskStats, useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { StatCardSkeleton, TaskCardSkeleton } from '../../components/ui/Skeleton';
import Card from '../../components/ui/Card';
import TaskCard from '../../components/tasks/TaskCard';
import EmptyState from '../../components/shared/EmptyState';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/helpers';

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const statCards = [
  { key: 'total', label: 'Total Tasks', icon: CheckCircle, color: 'text-primary-500', bg: 'bg-primary-100 dark:bg-primary-900/30' },
  { key: 'inProgress', label: 'In Progress', icon: Clock, color: 'text-warning-500', bg: 'bg-warning-100 dark:bg-warning-900/30' },
  { key: 'done', label: 'Completed', icon: TrendingUp, color: 'text-success-500', bg: 'bg-success-100 dark:bg-success-900/30' },
  { key: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'text-danger-500', bg: 'bg-danger-100 dark:bg-danger-900/30' },
];

/**
 * Dashboard page with stats and recent tasks
 */
const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useTaskStats();
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ limit: '6', sort: '-updatedAt' });
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { openCreateModal } = useUIStore();

  const stats = statsData?.data;
  const tasks = tasksData?.data || [];
  const projects = projectsData?.data || [];

  const getStatValue = (key) => {
    if (!stats) return 0;
    if (key === 'total') return stats.total || 0;
    if (key === 'inProgress') return stats.byStatus?.in_progress || 0;
    if (key === 'done') return stats.byStatus?.done || 0;
    if (key === 'overdue') return stats.overdue || 0;
    return 0;
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', card.bg)}>
                      <Icon className={cn('w-5 h-5', card.color)} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-surface-900 dark:text-white">
                    {getStatValue(card.key)}
                  </p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{card.label}</p>
                </Card>
              </motion.div>
            );
          })
        }
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Tasks</h2>
        </div>
        {tasksLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <TaskCardSkeleton key={i} />)}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon="tasks"
            title="No tasks yet"
            description="Create your first task and start being productive!"
            actionLabel="Create Task"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Projects Overview */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Projects</h2>
        {projectsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-6 space-y-3">
                <StatCardSkeleton />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon="projects"
            title="No projects yet"
            description="Create a project to organize your tasks."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => {
              const total = Object.values(project.taskCounts || {}).reduce((a, b) => a + b, 0);
              const done = project.taskCounts?.done || 0;
              const progress = total ? Math.round((done / total) * 100) : 0;

              return (
                <Card key={project._id} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">{project.name}</h3>
                      <p className="text-xs text-surface-500">{project.members?.length || 0} members</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-surface-500">
                      <span>{done}/{total} tasks</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, backgroundColor: project.color }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
