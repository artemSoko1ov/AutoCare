import { Prisma } from '@prisma/client';
import type { UserDto } from '@shared/contracts/auth';

export const userDtoSelect = {
  id: true,
  email: true,
  username: true,
  phone: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserDtoSource = Prisma.UserGetPayload<{
  select: typeof userDtoSelect;
}>;

export const toUserDto = (user: UserDtoSource): UserDto => ({
  id: user.id,
  email: user.email,
  username: user.username,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
