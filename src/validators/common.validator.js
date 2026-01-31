import mongoose from 'mongoose';
import z from 'zod';

export const zObjectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid MongoDB ObjectId' });
