import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    hashedToken: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    family: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - auto-delete expired tokens
    },
  },
  {
    timestamps: true,
  }
);

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
