import { z } from 'zod';
import { userDtoSchema } from './user.contract';

export const LoginBodySchema = z.object({
  email: z.email('Некорректный email'),
  password: z
    .string()
    .min(1, 'Введите пароль'),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  user: userDtoSchema,
});

export type LoginBody = z.infer<typeof LoginBodySchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
