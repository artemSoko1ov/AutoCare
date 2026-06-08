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
  UserRole,
} from '@shared/contracts/auth';
import type { AuthTokenPayload } from '../../common/types/auth-token-payload';
import { TokensService } from '../tokens/tokens.service';

const DEFAULT_ADMIN_EMAIL = 'admin@admin.admin';
const DEFAULT_ADMIN_PASSWORD = 'admin.admin';
const DEFAULT_ADMIN_USERNAME = 'Administrator';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokensService,
  ) {}

  private normalizeEnvValue(value: string): string {
    const trimmedValue = value.trim().replace(/;+$/, '').trim();

    if (
      (trimmedValue.startsWith("'") && trimmedValue.endsWith("'")) ||
      (trimmedValue.startsWith('"') && trimmedValue.endsWith('"'))
    ) {
      return trimmedValue.slice(1, -1).trim();
    }

    return trimmedValue;
  }

  private getOptionalEnvValue(value: string | undefined, fallbackValue: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return fallbackValue;
    }

    const normalizedValue = this.normalizeEnvValue(value);
    return normalizedValue.length > 0 ? normalizedValue : fallbackValue;
  }

  private getAdminCredentials() {
    const email = this.getOptionalEnvValue(
      process.env.ADMIN_EMAIL,
      DEFAULT_ADMIN_EMAIL,
    ).toLowerCase();

    const password = this.getOptionalEnvValue(
      process.env.ADMIN_PASSWORD,
      DEFAULT_ADMIN_PASSWORD,
    );

    const username = this.getOptionalEnvValue(
      process.env.ADMIN_USERNAME,
      DEFAULT_ADMIN_USERNAME,
    );

    return {
      email,
      password,
      username,
    };
  }

  private toUserDto(user: {
    id: string;
    email: string;
    username: string;
    phone: string | null;
    avatarUrl: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }): UserDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private toTokenPayload(user: {
    id: string;
    email: string;
    username: string;
    phone: string | null;
    avatarUrl: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
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

  private isReservedAdminEmail(email: string): boolean {
    return email.trim().toLowerCase() === this.getAdminCredentials().email;
  }

  private isAdminCredentials(email: string, password: string): boolean {
    const adminCredentials = this.getAdminCredentials();

    return (
      email.trim().toLowerCase() === adminCredentials.email &&
      password === adminCredentials.password
    );
  }

  private async ensureAdminUser() {
    const adminCredentials = this.getAdminCredentials();

    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: adminCredentials.email },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatarUrl: true,
        role: true,
        password: true,
        sessionVersion: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminCredentials.password, 10);

      return this.prisma.user.create({
        data: {
          email: adminCredentials.email,
          username: adminCredentials.username,
          password: passwordHash,
          phone: null,
          avatarUrl: null,
          role: 'ADMIN',
        },
        select: {
          id: true,
          email: true,
          username: true,
          phone: true,
          avatarUrl: true,
          role: true,
          password: true,
          sessionVersion: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    const hasExpectedPassword = await bcrypt.compare(
      adminCredentials.password,
      existingAdmin.password,
    );

    if (existingAdmin.role === 'ADMIN' && hasExpectedPassword) {
      return existingAdmin;
    }

    const passwordHash = await bcrypt.hash(adminCredentials.password, 10);

    return this.prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email: adminCredentials.email,
        username: adminCredentials.username,
        password: passwordHash,
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatarUrl: true,
        role: true,
        password: true,
        sessionVersion: true,
        createdAt: true,
        updatedAt: true,
      },
    });
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
    if (this.isReservedAdminEmail(email)) {
      throw new ConflictException(
        'Этот email зарезервирован для администратора',
      );
    }

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
        phone: null,
        avatarUrl: null,
      },
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

    const userDto = this.toUserDto(user);
    const tokens = this.tokenService.generateTokens(this.toTokenPayload(user));
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      ...userDto,
    };
  }

  async login({ email, password }: LoginBody): Promise<TokensDto & UserDto> {
    if (this.isAdminCredentials(email, password)) {
      const adminUser = await this.ensureAdminUser();
      const userDto = this.toUserDto(adminUser);
      const tokens = this.tokenService.generateTokens(
        this.toTokenPayload(adminUser),
      );
      await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

      return {
        ...tokens,
        ...userDto,
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatarUrl: true,
        role: true,
        password: true,
        sessionVersion: true,
        createdAt: true,
        updatedAt: true,
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
        phone: true,
        avatarUrl: true,
        role: true,
        sessionVersion: true,
        createdAt: true,
        updatedAt: true,
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
