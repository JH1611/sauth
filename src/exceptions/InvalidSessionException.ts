import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidSessionException extends HttpException {
  constructor() {
    super('Invalid session', HttpStatus.UNAUTHORIZED);
  }
}
