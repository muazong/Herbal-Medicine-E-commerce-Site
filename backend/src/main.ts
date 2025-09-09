import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(Logger);
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT');

  app.enableCors({
    origin: configService.getOrThrow('CLIENT_URL'),
    credentials: true,
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(PORT, () =>
    logger.log(`Server running on http://localhost:${PORT}`, 'PORT'),
  );
}
bootstrap();
