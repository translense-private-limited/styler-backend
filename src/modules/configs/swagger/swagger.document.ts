import { INestApplication } from '@nestjs/common';
import {
  OpenAPIObject,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  adminSwaggerConfig,
  clientSwaggerConfig,
  customerSwaggerConfig,
  swaggerConfig,
} from './swagger.config';

const swaggerDocumentOption: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};

export function createSwaggerDocument(app: INestApplication): OpenAPIObject {
  return SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerDocumentOption,
  );
}

export function createAdminSwaggerDocument(
  app: INestApplication,
): OpenAPIObject {
  return SwaggerModule.createDocument(
    app,
    adminSwaggerConfig,
    swaggerDocumentOption,
  );
}

export function createClientSwaggerDocument(
  app: INestApplication,
): OpenAPIObject {
  return SwaggerModule.createDocument(
    app,
    clientSwaggerConfig,
    swaggerDocumentOption,
  );
}

export function createCustomerSwaggerDocument(
  app: INestApplication,
): OpenAPIObject {
  return SwaggerModule.createDocument(
    app,
    customerSwaggerConfig,
    swaggerDocumentOption,
  );
}
