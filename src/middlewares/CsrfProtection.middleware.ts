import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { doubleCsrf } from 'csrf-csrf';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfProtectionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { validateRequest, generateToken } = doubleCsrf({
      getSecret: () => process.env.CSRF_SECRET,
      cookieName: 'x-csrf-secret',
      cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1000 * 60 * 60),
        path: '/',
        secure: true,
      },
      size: 64,
      ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
      getTokenFromRequest: (req) => req.body?.csrfToken,
    });

    if (
      !['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
      !validateRequest(req)
    ) {
      throw new ForbiddenException('Invalid csrf token');
    }
    req.csrfToken = () => generateToken(res, req);

    next();
  }
}
