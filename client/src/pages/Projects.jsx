import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useProjects, useCreateProject } from '../hooks/useProjects';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import EmptyState from '../components/shared/EmptyState';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { toast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(2000).optional(),
  color: z.string().optional(),
});

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const Projects = () => {
  const { data, isLoading } = useProjects();
  const createMutation = useCreateProject();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { color: '#6366f1' },
  });

  const projects = data?.data || [];

  const onSubmit = (formData) => {
    createMutation.mutate(formData, {
      onSuccess: () => { toast.success('Project created!'); setShowModal(false); reset(); },
      onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
    });
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Projects</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">{projects.length} projects</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState icon="projects" title="No projects" description="Create a project to organize your tasks." actionLabel="Create Project" onAction={() => setShowModal(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const total = Object.values(project.taskCounts || {}).reduce((a, b) => a + b, 0);
            const done = project.taskCounts?.done || 0;
            const progress = total ? Math.round((done / total) * 100) : 0;

            return (
              <Card key={project._id} onClick={() => navigate(`/projects/${project._id}`)} className="p-6 cursor-pointer hover:border-primary-400 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: project.color }}>
                    {project.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-white">{project.name}</h3>
                    <p className="text-xs text-surface-500">{project.members?.length} members</p>
                  </div>
                </div>
                {project.description && <p className="text-xs text-surface-500 mb-4 line-clamp-2">{project.description}</p>}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-surface-500">
                    <span>{done}/{total} tasks</span><span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full">
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: project.color }} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Project">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input id="proj-name" label="Name" error={errors.name?.message} {...register('name')} />
          <Textarea id="proj-desc" label="Description" {...register('description')} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Color</label>
            <input type="color" {...register('color')} className="w-full h-10 rounded-lg cursor-pointer" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Create</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Projects;
