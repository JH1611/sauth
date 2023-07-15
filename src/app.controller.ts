import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: 'Hello' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected')
  protected() {
    return { message: 'Hi from protected route' };
  }

  @Get('/csrf')
  csrf(@Req() req: Request) {
    return { csrfToken: req?.csrfToken() };
  }
}
