import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import * as cookieParser from 'cookie-parser';
import { InvalidSessionExceptionFilter } from './exceptions/InvalidSessionExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new InvalidSessionExceptionFilter());
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
