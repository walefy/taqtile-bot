import { createMethodMiddlewareDecorator } from 'type-graphql';
import { AuthGuardContext } from '../types/auth-guard-context';
import { AuthenticationException } from '../exceptions/authentication-exception';
import { TokenService } from '../services/token-service';

export function AuthGuard() {
  return createMethodMiddlewareDecorator<AuthGuardContext>(async ({ context }, next) => {
    const authorization = context.req.headers['authorization'];

    if (!authorization) {
      throw new AuthenticationException('Token not provided');
    }

    try {
      const token = authorization.split(' ')[1];
      const tokenService = new TokenService();
      const payload = tokenService.verifyToken(token) as { sub: string };
      context.auth = { user: { email: payload.sub } };
    } catch {
      throw new AuthenticationException('Invalid or expired token');
    }

    return next();
  });
}
