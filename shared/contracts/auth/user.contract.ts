import { z } from 'zod';
import {
  isImageValueWithinSizeLimit,
  isSupportedImageValue,
} from '../common/image-value.contract';

export const userRoleSchema = z.enum(['USER', 'ADMIN']);

export const nullableImageValueSchema = z
  .string()
  .refine(isSupportedImageValue, 'Некорректная ссылка на изображение')
  .refine(
    isImageValueWithinSizeLimit,
    'Размер изображения не должен превышать 5 МБ',
  )
  .nullable();

export const userDtoSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string(),
  phone: z.string().nullable(),
  avatarUrl: nullableImageValueSchema,
  role: userRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
