import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email("Invalid email address"),
  password: z.string().min(8, 'Password must be at least 6 characters long'),
  type: z.enum(['user', 'admin']),
});

export default userSchema;