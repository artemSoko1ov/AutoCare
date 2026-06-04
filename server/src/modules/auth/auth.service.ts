import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import type {
  LoginBody,
  RegisterBody,
  TokensDto,
  UserDto,
} from '@shared/contracts/auth';
import type { AuthTokenPayload } from '../../common/types/auth-token-payload';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokensService,
  ) {}

  private toUserDto(user: {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
  }): UserDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private toTokenPayload(user: {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    sessionVersion: number;
  }): AuthTokenPayload {
    return {
      ...this.toUserDto(user),
      sessionVersion: user.sessionVersion,
    };
  }

  private extractBearerToken(authHeader?: string): string | null {
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const accessToken = authHeader.slice('Bearer '.length).trim();
    return accessToken || null;
  }

  private resolveUserIdFromTokens(
    refreshToken?: string,
    authHeader?: string,
  ): string | null {
    const accessToken = this.extractBearerToken(authHeader);
    if (accessToken) {
      const accessPayload = this.tokenService.validateAccessToken(accessToken);
      if (accessPayload) {
        return accessPayload.id;
      }
    }

    if (!refreshToken) {
      return null;
    }

    const refreshPayload = this.tokenService.validateRefreshToken(refreshToken);
    return refreshPayload?.id ?? null;
  }

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
        sessionVersion: true,
        createdAt: true,
      },
    });

    const userDto = this.toUserDto(user);
    const tokens = this.tokenService.generateTokens(this.toTokenPayload(user));
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      ...userDto,
    };
  }

  async login({ email, password }: LoginBody): Promise<TokensDto & UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        sessionVersion: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const userDto = this.toUserDto(user);
    const tokens = this.tokenService.generateTokens(this.toTokenPayload(user));
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      ...userDto,
    };
  }

  async logout(refreshToken?: string, authHeader?: string) {
    const userId = this.resolveUserIdFromTokens(refreshToken, authHeader);

    if (!userId) {
      if (refreshToken) {
        await this.tokenService.removeToken(refreshToken);
      }
      return;
    }

    await this.prisma.$transaction([
      this.prisma.user.updateMany({
        where: { id: userId },
        data: {
          sessionVersion: {
            increment: 1,
          },
        },
      }),
      this.prisma.token.deleteMany({
        where: { userId },
      }),
    ]);
  }

  async refresh(refreshToken: string): Promise<TokensDto & UserDto> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userData.id },
      select: {
        id: true,
        email: true,
        username: true,
        sessionVersion: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.sessionVersion !== userData.sessionVersion) {
      throw new UnauthorizedException();
    }

    const userDto = this.toUserDto(user);
    const tokens = this.tokenService.generateTokens(this.toTokenPayload(user));
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      ...userDto,
    };
  }
}
