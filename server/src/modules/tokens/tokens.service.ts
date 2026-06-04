import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import type { TokensDto } from '@shared/contracts/auth';
import jwt from 'jsonwebtoken';
import type { AuthTokenPayload } from '../../common/types/auth-token-payload';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  generateTokens(payload: AuthTokenPayload): TokensDto {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets are not defined');
    }
    const accessToken = jwt.sign(payload, accessSecret, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: string, refreshToken: string) {
    return this.prisma.token.upsert({
      where: { userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  }

  async removeToken(refreshToken: string) {
    return this.prisma.token.deleteMany({
      where: { refreshToken },
    });
  }

  async findToken(refreshToken: string) {
    return this.prisma.token.findFirst({
      where: { refreshToken },
    });
  }

  private validateToken(
    token: string,
    secret: string,
  ): AuthTokenPayload | null {
    try {
      const payload = jwt.verify(token, secret);

      if (typeof payload === 'string') {
        return null;
      }

      const { id, email, username, createdAt, sessionVersion } = payload;
      if (
        typeof id !== 'string' ||
        typeof email !== 'string' ||
        typeof username !== 'string' ||
        typeof createdAt !== 'string' ||
        typeof sessionVersion !== 'number'
      ) {
        return null;
      }

      return {
        id,
        email,
        username,
        createdAt,
        sessionVersion,
      };
    } catch {
      return null;
    }
  }

  validateAccessToken(token: string): AuthTokenPayload | null {
    const accessSecret = process.env.JWT_ACCESS_SECRET;

    if (!accessSecret) {
      throw new Error('JWT secrets are not defined');
    }

    return this.validateToken(token, accessSecret);
  }

  validateRefreshToken(token: string): AuthTokenPayload | null {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!refreshSecret) {
      throw new Error('JWT secrets are not defined');
    }

    return this.validateToken(token, refreshSecret);
  }
}
