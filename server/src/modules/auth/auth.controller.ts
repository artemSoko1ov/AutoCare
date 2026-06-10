import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { LoginBodySchema, RegisterBodySchema } from '@shared/contracts/auth';
import type {
  LoginBody,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
  TokensDto,
  UserDto,
} from '@shared/contracts/auth';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshTokenAndReturn(
    res: Response,
    userData: TokensDto & UserDto,
  ): RegisterResponse | LoginResponse {
    const { accessToken, refreshToken, ...userFields } = userData;

    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return {
      accessToken,
      user: userFields,
    };
  }

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterBodySchema)) data: RegisterBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.register(data);
    return this.setRefreshTokenAndReturn(res, userData);
  }

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginBodySchema)) data: LoginBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.login(data);
    return this.setRefreshTokenAndReturn(res, userData);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken =
      typeof req.cookies?.refreshToken === 'string'
        ? req.cookies.refreshToken
        : undefined;
    const authHeader =
      typeof req.headers.authorization === 'string'
        ? req.headers.authorization
        : undefined;

    if (!refreshToken) {
      await this.authService.logout(undefined, authHeader);
      res.clearCookie('refreshToken');
      return;
    }

    await this.authService.logout(refreshToken, authHeader);

    res.clearCookie('refreshToken');
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const requestRefreshToken =
      typeof req.cookies?.refreshToken === 'string'
        ? req.cookies.refreshToken
        : undefined;
    const userData = await this.authService.refresh(requestRefreshToken ?? '');
    return this.setRefreshTokenAndReturn(res, userData);
  }
}
