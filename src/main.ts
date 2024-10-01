import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as csurf from 'csurf';
import { AppModule } from './app/app.module';
import { swaggerSetup } from './modules/configs/swagger/swagger.setup';
import { EnvService } from './modules/configs/env/services/env.service';
import { AppConfig } from './modules/configs/env/app.config';
import { EnvNamespace } from './modules/configs/env/enums/env-namespace.enum';
import { ValidationPipe } from '@nestjs/common';
import { createWinstonLoggerService } from './utils/logger/winston-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLoggerService(),
  });
  const envService = app.get(EnvService);
  const port = envService.getEnvValue<AppConfig>(EnvNamespace.APP_CONFIG).port;
  //app.enableCors({ methods: '*', origin: '*', credentials: true });
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
    allowedHeaders: '*', // Allow all headers
    credentials: true, // Allow credentials
  });

  swaggerSetup(app);
  // Utilised for validating the input field based on dto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //automatically transform to type specified by validator
    }),
  );

  await app.listen(port);

  app.use(csurf());
  app.use(helmet());
}
bootstrap();
