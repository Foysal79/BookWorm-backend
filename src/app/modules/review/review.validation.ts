import z from "zod";

const reviewValidation = z.object({
  body: z.object({
    book: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }),
});

export const reviewValidationSchema = {
  reviewValidation,
};
