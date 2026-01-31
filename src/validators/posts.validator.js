import z from 'zod';

import { zObjectId } from './common.validator.js';

export const createPostBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(10000),
  imageUrl: z.string().url().optional().nullable(),
});

export const getPostByIdParamSchema = z.object({
  postId: zObjectId,
});

export const updatePostByIdBodySchema = createPostBodySchema.partial();

export const updatePostByIdParamSchema = z.object({
  postId: zObjectId,
});

export const deletePostByIdParamSchema = z.object({
  postId: zObjectId,
});
