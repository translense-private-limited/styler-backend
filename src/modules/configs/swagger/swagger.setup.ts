import { INestApplication } from '@nestjs/common';
import { SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import {
  createAdminSwaggerDocument,
  createClientSwaggerDocument,
  createCustomerSwaggerDocument,
  createSwaggerDocument,
} from './swagger.document';
const swaggerCustomerOption: SwaggerCustomOptions = {
  customSiteTitle: 'styler Api Docs',
  customfavIcon:
    'https://media.licdn.com/dms/image/C560BAQEgOil_8sLTAA/company-logo_100_100/0/1667873121695/translense_private_limited_logo?e=2147483647&v=beta&t=aoMhGOadwe8RCtjwOLUo9EUg8zLUUpegXeo5LSpfXWY   ',
};
function filterPathsByPrefix(document: any, prefixes: string[]) {
  const filteredPaths = {};
  for (const [path, operations] of Object.entries(document.paths)) {
    if (prefixes.some((prefix) => path.startsWith(prefix))) {
      filteredPaths[path] = operations;
    }
  }
  document.paths = filteredPaths;
}

function filterPathsByNotPrefix(document: any, prefixes: string[]) {
  const filteredPaths = {};
  for (const [path, operations] of Object.entries(document.paths)) {
    if (!prefixes.some((prefix) => path.startsWith(prefix))) {
      filteredPaths[path] = operations;
    }
  }
  document.paths = filteredPaths;
}

export function swaggerSetup(app: INestApplication) {
  const swaggerDocument = createSwaggerDocument(app);
  SwaggerModule.setup('swagger', app, swaggerDocument, swaggerCustomerOption);

  const adminSwaggerDocument = createAdminSwaggerDocument(app);
  filterPathsByPrefix(adminSwaggerDocument, ['/admin']);
  SwaggerModule.setup(
    'swagger/admin',
    app,
    adminSwaggerDocument,
    swaggerCustomerOption,
  );

  const clientSwaggerDocument = createClientSwaggerDocument(app);
  filterPathsByPrefix(clientSwaggerDocument, ['/client']);
  SwaggerModule.setup(
    'swagger/client',
    app,
    clientSwaggerDocument,
    swaggerCustomerOption,
  );

  const customerSwaggerDocument = createCustomerSwaggerDocument(app);
  filterPathsByNotPrefix(customerSwaggerDocument, ['/admin', '/client']);
  SwaggerModule.setup(
    'swagger/customer',
    app,
    customerSwaggerDocument,
    swaggerCustomerOption,
  );

  // Define configurations for each category
}