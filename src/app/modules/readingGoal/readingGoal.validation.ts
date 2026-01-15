import { z } from "zod";

const createSchema = z.object({
  body: z.object({
    user: z.string(),
    period: z.enum(["weekly", "monthly", "yearly"]),
    targetBook: z.number().min(1),
    startDate: z.date().min(1),
    endDate: z.date().min(1),
  }),
});

const updateSchema = z.object({
  body: z.object({
    targetBook: z.number().min(1).optional(),
    startDate: z.date().min(1).optional(),
    endDate: z.date().min(1).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ReadingGoalValidation = {
  createSchema,
  updateSchema,
};
