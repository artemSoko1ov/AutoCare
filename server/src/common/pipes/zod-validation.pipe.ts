import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';

type ValidationIssue = {
  path: PropertyKey[];
  message: string;
};

type SafeParseSuccess<T> = {
  success: true;
  data: T;
};

type SafeParseFailure = {
  success: false;
  error: {
    issues: ValidationIssue[];
  };
};

type ZodLikeSchema<T> = {
  safeParse: (value: unknown) => SafeParseSuccess<T> | SafeParseFailure;
};

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodLikeSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues.map(({ path, message }) => ({
          field: path.length > 0 ? path.map(String).join('.') : 'root',
          message,
        })),
      });
    }

    return result.data;
  }
}
