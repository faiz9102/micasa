import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email("Invalid email address"),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  phoneNumber: z.string().trim().regex(/^\d{10,11}$/, "Phone number must be 10 or 11 digits"),
  role: z.enum(['user', 'admin']),
});

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export default userSchema;
