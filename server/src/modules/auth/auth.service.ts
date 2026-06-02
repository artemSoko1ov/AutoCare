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
import { TokensService } from '../tokens/tokens.service';

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

  async login({ email, password }: LoginBody): Promise<TokensDto & UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
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

    const userDto: UserDto = {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt.toISOString(),
    };

    const tokens = this.tokenService.generateTokens(userDto);
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      ...userDto,
    };
  }

  async logout(refreshToken: string) {
    return this.tokenService.removeToken(refreshToken);
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

    if (typeof userData === 'string' || !('id' in userData)) {
      throw new UnauthorizedException();
    }

    const payload = userData as Record<string, unknown>;
    const userId = payload.id;
    if (typeof userId !== 'string') {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const userDto: UserDto = {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt.toISOString(),
    };
    const tokens = this.tokenService.generateTokens(userDto);
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      ...userDto,
    };
  }
}
