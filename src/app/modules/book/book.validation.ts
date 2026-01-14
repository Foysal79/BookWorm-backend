import z from "zod";

const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    author: z.string().min(2),
    description: z.string().optional(),
    coverImageUrl: z.string().url(),
    genre: z.string().min(1),
  }),
});

const updateBookSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    author: z.string().min(2).optional(),
    description: z.string().optional(),
    coverImageUrl: z.string().url().optional(),
    genre: z.string().min(1).optional(),
  }),
});

export const bookValidation = {
  createBookSchema,
  updateBookSchema,
};
