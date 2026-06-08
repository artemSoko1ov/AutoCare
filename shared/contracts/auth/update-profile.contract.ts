import { z } from 'zod';
import { nullableImageValueSchema, userDtoSchema } from './user.contract';

const emptyStringToNull = (value: unknown) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? null : trimmedValue;
};

export const UpdateProfileBodySchema = z.object({
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
  avatarUrl: z.preprocess(
    emptyStringToNull,
    nullableImageValueSchema,
  ),
});

export const UpdateProfileResponseSchema = userDtoSchema;

export type UpdateProfileBody = z.infer<typeof UpdateProfileBodySchema>;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;
