import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (request.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access only');
    }

    return true;
  }
}
