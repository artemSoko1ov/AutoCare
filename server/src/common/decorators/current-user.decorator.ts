import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { UserDto } from '@shared/contracts/auth';
import type { AuthenticatedRequest } from '../types/authenticated-request';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserDto => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
