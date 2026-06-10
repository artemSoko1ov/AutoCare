import { z } from 'zod';
import { userDtoSchema } from './user.contract';

const emptyStringToNull = (value: unknown) => {
  if (value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? null : trimmedValue;
};

export const RegisterBodySchema = z.object({
  email: z.email('Некорректный email'),
  username: z
    .string()
    .trim()
    .min(3, 'Имя должно быть минимум 3 символа')
    .max(20, 'Имя должно быть максимум 20 символов'),
  phone: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .regex(/^\+?[0-9()\-\s]{7,20}$/, 'Некорректный номер телефона')
      .nullable(),
  ),
  password: z
    .string()
    .min(6, 'Пароль должен быть минимум 6 символов')
    .max(64, 'Пароль должен быть максимум 64 символа'),
});

export const RegisterResponseSchema = z.object({
  accessToken: z.string(),
  user: userDtoSchema,
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
