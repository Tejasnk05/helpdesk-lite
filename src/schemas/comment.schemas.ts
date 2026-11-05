import { z } from 'zod';

export const createCommentSchema = z.strictObject({
  body: z
    .string({ error: 'body is required and must be a string' })
    .trim()
    .min(1, 'body must not be empty')
    .max(5000, 'body must be at most 5000 characters'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;