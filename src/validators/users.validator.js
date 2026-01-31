import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().trim().min(2, 'username must be at least 2 characters'),
  email: z.email().trim(),
  password: z.string().min(6, 'password must be at least 6 characters'),
  role: z.enum(['admin', 'user']).default('user'),
});
