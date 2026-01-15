import { z } from "zod";

const createSchema = z.object({
  body: z.object({
    user: z.string().optional(),
    period: z.enum(["weekly", "monthly", "yearly"]),
    targetBook: z.number().min(1),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid startDate",
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid endDate",
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    targetBook: z.number().min(1).optional(),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid startDate",
      })
      .optional(),
    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid endDate",
      })
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ReadingGoalValidation = {
  createSchema,
  updateSchema,
};
