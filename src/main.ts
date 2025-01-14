import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as csurf from 'csurf';
import { AppModule } from './app/app.module';
import { swaggerSetup } from './modules/configs/swagger/swagger.setup';
import { EnvService } from './modules/configs/env/services/env.service';
import { AppConfigInterface } from './modules/configs/env/app.config';
import { EnvNamespaceEnum } from './modules/configs/env/enums/env-namespace.enum';
import { ValidationPipe } from '@nestjs/common';
import { createWinstonLoggerService } from './utils/logger/winston-logger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createWinstonLoggerService(),
  });
  const envService = app.get(EnvService);
  const port = envService.getEnvValue<AppConfigInterface>(
    EnvNamespaceEnum.APP_CONFIG,
  ).port;
  //app.enableCors({ methods: '*', origin: '*', credentials: true });
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Allow all methods
    allowedHeaders: '*', // Allow all headers
    credentials: true, // Allow credentials
  });

  swaggerSetup(app);
  // Utilized for validating the input field based on dto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //automatically transform to type specified by validator
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'public'));

  await app.listen(port);

  app.use(csurf());
  //   app.use(helmet({
  //   contentSecurityPolicy: false, // Disable the strict content security policy (if needed)
  // }));
}
bootstrap();
