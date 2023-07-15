import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import * as cookieParser from 'cookie-parser';
import { InvalidSessionExceptionFilter } from './exceptions/InvalidSessionExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.FRONTEND_URL });
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new InvalidSessionExceptionFilter());
  await app.listen(4000);
}
bootstrap();
