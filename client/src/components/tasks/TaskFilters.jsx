import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Select from '../ui/Select';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

/**
 * Task filter bar component
 */
const TaskFilters = ({ filters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'btn-secondary gap-2',
            hasActiveFilters && 'border-primary-400 text-primary-600'
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-surface-500 hover:text-surface-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700 animate-fadeIn">
          <Select
            label="Status"
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-40"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </Select>

          <Select
            label="Priority"
            value={filters.priority || ''}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-40"
          >
            <option value="">All Priorities</option>
            {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </Select>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Sort</label>
            <select
              value={filters.sort || '-createdAt'}
              onChange={(e) => handleChange('sort', e.target.value)}
              className="input-field w-40"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="dueDate">Due Date</option>
              <option value="-priority">Priority</option>
              <option value="position">Position</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
