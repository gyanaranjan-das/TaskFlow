import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { KANBAN_COLUMNS, STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';
import { useReorderTasks, useUpdateTask } from '../../hooks/useTasks';
import { KanbanColumnSkeleton } from '../ui/Skeleton';
import EmptyState from '../shared/EmptyState';
import { cn } from '../../utils/helpers';
import { Plus } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

/**
 * Kanban board with drag-and-drop columns
 */
const KanbanBoard = ({ tasks = [], isLoading }) => {
  const reorderMutation = useReorderTasks();
  const updateMutation = useUpdateTask();
  const { openCreateModal } = useUIStore();

  // Group tasks by status
  const columns = KANBAN_COLUMNS.map((col) => ({
    ...col,
    tasks: tasks
      .filter((t) => t.status === col.id)
      .sort((a, b) => (a.position || 0) - (b.position || 0)),
  }));

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Find source and destination columns
    const sourceCol = columns.find((c) => c.id === source.droppableId);
    const destCol = columns.find((c) => c.id === destination.droppableId);

    if (!sourceCol || !destCol) return;

    // Build new task order
    const sourceTasks = [...sourceCol.tasks];
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : [...destCol.tasks];

    const [movedTask] = sourceTasks.splice(source.index, 1);

    const updatedTask = { ...movedTask, status: destination.droppableId };
    destTasks.splice(destination.index, 0, updatedTask);

    // Build reorder payload
    const reorderPayload = destTasks.map((t, i) => ({
      id: t._id,
      status: destination.droppableId,
      position: i,
    }));

    // If columns differ, also reorder source
    if (source.droppableId !== destination.droppableId) {
      sourceTasks.forEach((t, i) => {
        reorderPayload.push({ id: t._id, status: source.droppableId, position: i });
      });
    }

    // Optimistic update
    updateMutation.mutate({
      id: draggableId,
      updates: { status: destination.droppableId, position: destination.index },
    });

    reorderMutation.mutate(reorderPayload);
  };

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumnSkeleton key={col.id} />
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
        {columns.map((column) => (
          <div key={column.id} className="w-72 shrink-0">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={cn('w-2.5 h-2.5 rounded-full', STATUS_COLORS[column.id])} />
                <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300">
                  {column.title}
                </h3>
                <span className="text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <button
                onClick={openCreateModal}
                className="p-1 rounded-md text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'min-h-[200px] space-y-3 p-1 rounded-xl transition-colors duration-200',
                    snapshot.isDraggingOver && 'bg-primary-50/50 dark:bg-primary-900/10'
                  )}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <TaskCard
                          task={task}
                          isDragging={snapshot.isDragging}
                          provided={provided}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {column.tasks.length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-700 text-surface-400 text-xs">
                      Drop tasks here
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
