import { Body, Controller, Post, Res } from '@nestjs/common';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { type RegisterBody, RegisterResponse } from '@shared/contracts/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() data: RegisterBody,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponse> {
    const userData = await this.authService.register(data);
    const { accessToken, refreshToken, ...userFields } = userData;

    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return {
      accessToken,
      user: userFields,
    };
  }
}
