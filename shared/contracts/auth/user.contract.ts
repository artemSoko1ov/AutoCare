import { z } from 'zod';

export const userRoleSchema = z.enum(['USER', 'ADMIN']);

export const userDtoSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string(),
  phone: z.string().nullable(),
  avatarUrl: z.url().nullable(),
  role: userRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
