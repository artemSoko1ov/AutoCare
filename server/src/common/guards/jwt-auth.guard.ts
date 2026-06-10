import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import type { UserDto } from '@shared/contracts/auth';
import { toUserDto } from '../mappers/user-dto.mapper';
import { TokensService } from '../../modules/tokens/tokens.service';
import type { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensService: TokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const accessToken = authHeader.slice('Bearer '.length).trim();
    if (!accessToken) {
      throw new UnauthorizedException('Access token is missing');
    }

    const userData = this.tokensService.validateAccessToken(accessToken);
    if (!userData) {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userData.id },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatarUrl: true,
        role: true,
        sessionVersion: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.sessionVersion !== userData.sessionVersion) {
      throw new UnauthorizedException('Session revoked');
    }

    request.user = toUserDto(user) satisfies UserDto;

    return true;
  }
}
