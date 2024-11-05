import { createMethodMiddlewareDecorator } from 'type-graphql';
import { AuthenticationError } from '@core/error';
import { AuthGuardContext } from '@graphql/server.context';
import { TokenService } from '@core/security';

export function AuthGuard() {
  return createMethodMiddlewareDecorator<AuthGuardContext>(async ({ context }, next) => {
    const authorization = context.req.headers['authorization'];

    if (!authorization) {
      throw new AuthenticationError('Token not provided');
    }

    try {
      const token = authorization.split(' ')[1];
      const tokenService = new TokenService();
      const payload = tokenService.verifyToken(token) as { sub: string };
      context.auth = { user: { email: payload.sub } };
    } catch {
      throw new AuthenticationError('Invalid or expired token');
    }

    return next();
  });
}
