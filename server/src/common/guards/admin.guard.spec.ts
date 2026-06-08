import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

const createExecutionContext = (
  request: Record<string, unknown>,
): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as ExecutionContext;

describe('AdminGuard', () => {
  it('allows admin users', () => {
    const guard = new AdminGuard();

    expect(
      guard.canActivate(
        createExecutionContext({
          user: {
            id: 'admin-1',
            role: 'ADMIN',
          },
        }),
      ),
    ).toBe(true);
  });

  it('rejects non-admin users', () => {
    const guard = new AdminGuard();

    expect(() =>
      guard.canActivate(
        createExecutionContext({
          user: {
            id: 'user-1',
            role: 'USER',
          },
        }),
      ),
    ).toThrow(ForbiddenException);
  });
});
