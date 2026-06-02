import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import type {
  LoginBody,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
  TokensDto,
  UserDto,
} from '@shared/contracts/auth';
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
    @Body() data: RegisterBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.register(data);
    return this.setRefreshTokenAndReturn(res, userData);
  }

  @Post('login')
  async login(
    @Body() data: LoginBody,
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

    if (!refreshToken) {
      res.clearCookie('refreshToken');
      return;
    }
    const token = await this.authService.logout(refreshToken);

    res.clearCookie('refreshToken');

    return token;
  }
}
