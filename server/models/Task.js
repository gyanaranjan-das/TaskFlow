import mongoose from 'mongoose';
import { STATUS_VALUES, PRIORITY_VALUES } from '../utils/constants.js';

const subtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Subtask title is required'],
      trim: true,
      maxlength: 200,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  size: { type: Number, default: 0 },
  mimetype: { type: String, default: '' },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: 'todo',
    },
    priority: {
      type: String,
      enum: PRIORITY_VALUES,
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task creator is required'],
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
      },
    ],
    subtasks: [subtaskSchema],
    attachments: [attachmentSchema],
    position: {
      type: Number,
      default: 0,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Text index for search
taskSchema.index({ title: 'text', description: 'text' });

// Single field indexes for filtering/sorting
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ project: 1 });
taskSchema.index({ creator: 1 });
taskSchema.index({ deletedAt: 1 });
taskSchema.index({ position: 1 });

// Auto-set completedAt when status changes to done
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'done' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'done') {
      this.completedAt = null;
    }
  }
  next();
});

// Virtual: subtask progress
taskSchema.virtual('subtaskProgress').get(function () {
  if (!this.subtasks || this.subtasks.length === 0) return null;
  const completed = this.subtasks.filter((s) => s.completed).length;
  return {
    completed,
    total: this.subtasks.length,
    percentage: Math.round((completed / this.subtasks.length) * 100),
  };
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
