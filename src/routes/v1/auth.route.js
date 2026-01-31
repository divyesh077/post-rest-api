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
import { validateBody } from '../../middlewares/validate.middleware.js';
import { loginUserSchema, registerUserSchema } from '../../validators/auth.validator.js';

const router = express.Router();

router.post('/signup', validateBody(registerUserSchema), signup);

router.post('/signin', validateBody(loginUserSchema), signin);

router.post('/signout', auth, signout);

router.post('/signout-all-devices', auth, signoutAllDevicesForUser);

router.post('/refresh-token', refresh);

router.post('/send-verification-email', sendVerificationEmail);

router.post('/verify-email', verifyEmail);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

export default router;
