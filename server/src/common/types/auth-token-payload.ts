import type { UserDto } from '@shared/contracts/auth';

export type AuthTokenPayload = UserDto & {
  sessionVersion: number;
};
