import express from 'express';

import {
  createPost,
  deletePostById,
  deletePosts,
  getPostById,
  getPosts,
  updatePostById,
} from '../../controllers/posts.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { validateBody, validateParams } from '../../middlewares/validate.middleware.js';
import {
  createPostBodySchema,
  deletePostByIdParamSchema,
  getPostByIdParamSchema,
  updatePostByIdBodySchema,
  updatePostByIdParamSchema,
} from '../../validators/posts.validator.js';

const router = express.Router();

router.post('/', auth, validateBody(createPostBodySchema), createPost);

router.get('/', auth, getPosts);
router.get('/:postId', auth, validateParams(getPostByIdParamSchema), getPostById);

router.put(
  '/:postId',
  auth,
  validateBody(updatePostByIdBodySchema),
  validateParams(updatePostByIdParamSchema),
  updatePostById
);

router.delete('/:postId', auth, validateParams(deletePostByIdParamSchema), deletePostById);
router.delete('/', auth, deletePosts);

export default router;
