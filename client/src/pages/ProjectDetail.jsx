import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskFilters from '../components/tasks/TaskFilters';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { useState } from 'react';

const ProjectDetail = () => {
  const { id } = useParams();
  const { data: projectData, isLoading: projectLoading } = useProject(id);
  const [filters, setFilters] = useState({});
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ ...filters, project: id });

  const project = projectData?.data;
  const tasks = tasksData?.data || [];

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="flex gap-6"><Skeleton className="h-64 w-72" /><Skeleton className="h-64 w-72" /></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: project.color }}>
            {project.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{project.name}</h1>
            {project.description && <p className="text-surface-500 mt-1">{project.description}</p>}
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm text-surface-500">Members:</span>
        {project.members?.map((m) => (
          <div key={m.user._id} className="flex items-center gap-2">
            <Avatar src={m.user.avatar?.url} name={m.user.name} size="xs" />
            <span className="text-sm text-surface-700 dark:text-surface-300">{m.user.name}</span>
            <Badge>{m.role}</Badge>
          </div>
        ))}
      </div>

      {/* Filters & Board */}
      <TaskFilters filters={filters} onFilterChange={setFilters} />
      <KanbanBoard tasks={tasks} isLoading={tasksLoading} />
    </motion.div>
  );
};

export default ProjectDetail;
