import type { UserDto } from '@shared/contracts/auth';
import type { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: UserDto;
};
