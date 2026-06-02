import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RegisterBody } from '@shared/contracts/auth';
import * as bcrypt from 'bcryptjs';
import { TokensService } from '../tokens/tokens.service';
import { TokensDto } from '@shared/contracts/auth/tokens.contract';
import { UserDto } from '@shared/contracts/auth/user.contract';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokensService,
  ) {}

  async register({
    email,
    username,
    password,
  }: RegisterBody): Promise<TokensDto & UserDto> {
    const candidate = await this.prisma.user.findUnique({
      where: { email },
    });

    if (candidate) {
      throw new ConflictException(
        `Пользователь с почтой ${email} уже существует`,
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    const userWithDate = {
      ...user,
      createdAt: user.createdAt.toISOString(),
    };

    const tokens = this.tokenService.generateTokens(userWithDate);
    await this.tokenService.saveToken(userWithDate.id, tokens.refreshToken);

    return {
      ...tokens,
      ...userWithDate,
    };
  }
}
