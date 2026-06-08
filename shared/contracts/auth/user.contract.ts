import { z } from 'zod';

export const userRoleSchema = z.enum(['USER', 'ADMIN']);

const isSupportedImageValue = (value: string) => {
  if (value.startsWith('data:image/')) {
    return true;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

export const nullableImageValueSchema = z
  .string()
  .refine(isSupportedImageValue, 'Некорректная ссылка на изображение')
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
