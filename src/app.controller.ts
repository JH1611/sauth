import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
}
