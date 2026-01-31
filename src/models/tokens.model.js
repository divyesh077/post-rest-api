import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['REFRESH_TOKEN', 'EMAIL_VERIFY_TOKEN', 'PASSWORD_RESET_TOKEN'],
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    meta: {
      ip: {
        type: String,
        default: null,
      },
      userAgent: {
        type: String,
        default: null,
      },
      deviceId: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Auto-delete expired tokens
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model('Token', tokenSchema);
