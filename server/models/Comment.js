import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Comment must belong to a task'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must have an author'],
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ task: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
