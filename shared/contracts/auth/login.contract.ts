import { z } from 'zod';

export const LoginBodySchema = z.object({
  email: z.email('Некорректный email'),
  password: z
    .string()
    .min(1, 'Введите пароль'),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.email(),
    username: z.string(),
    createdAt: z.string()
  }),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;