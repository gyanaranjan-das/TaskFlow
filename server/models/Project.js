import mongoose from 'mongoose';
import { PROJECT_ROLE_VALUES } from '../utils/constants.js';

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: PROJECT_ROLE_VALUES,
    default: 'member',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#([0-9A-Fa-f]{6})$/, 'Color must be a valid hex code'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner is required'],
    },
    members: [memberSchema],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.user': 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
