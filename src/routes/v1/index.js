import express from 'express';

import authRouter from './auth.route.js';
import postRouter from './posts.route.js';
import userRouter from './users.routes.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);

export default router;
