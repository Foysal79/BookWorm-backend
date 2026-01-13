import z from "zod";

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email().email("Please provide a valid email address."),
    password: z.string().min(6)
  }),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const updateRoleSchema = z.object({
  userId: z.string().length(24),
  role: z.enum(["Admin", "User"]),
});

export const userValidation = {
  registerSchema,
  loginSchema,
  updateRoleSchema,
};
