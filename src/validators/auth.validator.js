import z from 'zod';

import { userSchema } from './users.validator.js';

export const registerUserSchema = userSchema.pick({
  username: true,
  email: true,
  password: true,
});

export const loginUserSchema = registerUserSchema.pick({
  email: true,
  password: true,
});

export const logoutUserSchema = z.object({
  refreshToken: z.string().nonempty(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().nonempty(),
});

export const sendVerificationEmailSchema = registerUserSchema.pick({
  email: true,
});

export const verifyEmailQuerySchema = z.object({
  token: z.string().nonempty(),
});

export const forgotPasswordSchema = registerUserSchema.pick({
  email: true,
});

export const resetPasswordBodySchema = registerUserSchema.pick({
  password: true,
});

export const resetPasswordQuerySchema = z.object({
  token: z.string().nonempty(),
});
