import { BadRequestException } from '@nestjs/common';
import { LoginBodySchema } from '@shared/contracts/auth';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(LoginBodySchema);

  it('returns parsed data for a valid payload', () => {
    const payload = {
      email: 'user@example.com',
      password: 'secret',
    };

    expect(pipe.transform(payload)).toEqual(payload);
  });

  it('throws BadRequestException for an invalid payload', () => {
    try {
      pipe.transform({
        email: 'not-an-email',
        password: '',
      });

      fail('Expected transform to throw BadRequestException');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual({
        message: 'Validation failed',
        errors: [
          {
            field: 'email',
            message: 'Некорректный email',
          },
          {
            field: 'password',
            message: 'Введите пароль',
          },
        ],
      });
    }
  });
});
