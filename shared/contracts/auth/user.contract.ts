import { z } from 'zod';

export const userDtoSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  createdAt: z.string()
});

export type UserDto = z.infer<typeof userDtoSchema>;