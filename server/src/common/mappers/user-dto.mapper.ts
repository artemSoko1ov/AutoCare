import type { UserDto, UserRole } from '@shared/contracts/auth';

type UserDtoSource = {
  id: string;
  email: string;
  username: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

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
