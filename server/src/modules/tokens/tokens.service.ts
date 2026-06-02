import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import type { TokensDto, UserDto } from '@shared/contracts/auth';
import jwt from 'jsonwebtoken';

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
}
