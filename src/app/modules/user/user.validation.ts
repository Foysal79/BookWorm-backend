import z from "zod";

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name too short"),
    email: z.string().email().email("Please provide a valid email address."),
    password: z.string().min(6, "Password must be 6+ chars"),
    img: z.string().url().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(["Admin", "User"]),
  }),
});

export const userValidation = {
  registerSchema,
  loginSchema,
  updateRoleSchema,
};
