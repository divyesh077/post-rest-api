import express from 'express';

import {
  forgotPassword,
  refresh,
  resetPassword,
  sendVerificationEmail,
  signin,
  signout,
  signoutAllDevicesForUser,
  signup,
  verifyEmail,
} from '../../controllers/auth.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { validateBody, validateQuery } from '../../middlewares/validate.middleware.js';
import {
  forgotPasswordSchema,
  loginUserSchema,
  logoutUserSchema,
  refreshTokenSchema,
  registerUserSchema,
  resetPasswordBodySchema,
  resetPasswordQuerySchema,
  sendVerificationEmailSchema,
  verifyEmailQuerySchema,
} from '../../validators/auth.validator.js';

const router = express.Router();

router.post('/signup', validateBody(registerUserSchema), signup);

router.post('/signin', validateBody(loginUserSchema), signin);

router.post('/signout', validateBody(logoutUserSchema), auth, signout);

router.post('/signout-all-devices', auth, signoutAllDevicesForUser);

router.post('/refresh-token', validateBody(refreshTokenSchema), refresh);

router.post(
  '/send-verification-email',
  validateBody(sendVerificationEmailSchema),
  sendVerificationEmail
);

router.post('/verify-email', validateQuery(verifyEmailQuerySchema), verifyEmail);

router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword);

router.post(
  '/reset-password',
  validateQuery(resetPasswordQuerySchema),
  validateBody(resetPasswordBodySchema),
  resetPassword
);

export default router;
