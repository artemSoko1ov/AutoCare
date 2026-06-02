import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import jwt from 'jsonwebtoken';
import { UserDto } from '@shared/contracts/auth/user.contract';
import { TokensDto } from '@shared/contracts/auth/tokens.contract';

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
}
