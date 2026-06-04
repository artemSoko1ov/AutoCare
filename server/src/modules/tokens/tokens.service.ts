import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import type { TokensDto, UserDto } from '@shared/contracts/auth';
import jwt, { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  generateTokens(payload: UserDto): TokensDto {
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

  validateAccessToken(token: string): JwtPayload | string | null {
    const accessSecret = process.env.JWT_ACCESS_SECRET;

    if (!accessSecret) {
      throw new Error('JWT secrets are not defined');
    }
    try {
      return jwt.verify(token, accessSecret);
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string): JwtPayload | string | null {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!refreshSecret) {
      throw new Error('JWT secrets are not defined');
    }
    try {
      return jwt.verify(token, refreshSecret);
    } catch {
      return null;
    }
  }
}
