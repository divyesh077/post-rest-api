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
