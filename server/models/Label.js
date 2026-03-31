import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Label name is required'],
      trim: true,
      maxlength: [50, 'Label name cannot exceed 50 characters'],
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#([0-9A-Fa-f]{6})$/, 'Color must be a valid hex code'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Label must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: user + name must be unique
labelSchema.index({ user: 1, name: 1 }, { unique: true });

const Label = mongoose.model('Label', labelSchema);
export default Label;
