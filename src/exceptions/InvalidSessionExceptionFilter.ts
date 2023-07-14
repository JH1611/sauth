import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { InvalidSessionException } from './InvalidSessionException';

@Catch(InvalidSessionException)
export class InvalidSessionExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidSessionException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.clearCookie('session');

    const status = exception.getStatus();
    const message = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
