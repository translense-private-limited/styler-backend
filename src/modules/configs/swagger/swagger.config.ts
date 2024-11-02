import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Styler developed by Translense Private Limited')
  .setDescription('Comprehensive refernce for API development in NestJs')
  .setVersion('1.0.0')
  .setTermsOfService(
    'The API developed and maintained by Translense Private Limited is the sole property of Translense Private Limited, and unauthorized access or use is strictly prohibited. Such unauthorized access may lead to legal ramifications. Access to the API is granted solely to those who have obtained explicit permission from Translense Private Limited through official channels. Prohibited activities include attempting to bypass security measures or using the API for illegal purposes. Translense Private Limited reserves the right to enforce these terms through legal means and may modify them at its discretion. Users are responsible for regularly reviewing the terms for any updates.',
  )
  .setContact(
    'Atul singh',
    `https://www.translense.com/`,
    'atul.singh@translense.com',
  )
  .addServer('http://localhost:4000/', 'Dev Server')
  .addServer('http://35.200.210.193:4000/', 'Staging Server')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
  .build();

export const adminSwaggerConfig = new DocumentBuilder()
  .setTitle('Styler developed by Translense Private Limited')
  .setDescription('Styler Admin Api')
  .setVersion('1.0.0')
  .setTermsOfService(
    'The API developed and maintained by Translense Private Limited is the sole property of Translense Private Limited, and unauthorized access or use is strictly prohibited. Such unauthorized access may lead to legal ramifications. Access to the API is granted solely to those who have obtained explicit permission from Translense Private Limited through official channels. Prohibited activities include attempting to bypass security measures or using the API for illegal purposes. Translense Private Limited reserves the right to enforce these terms through legal means and may modify them at its discretion. Users are responsible for regularly reviewing the terms for any updates.',
  )
  .setContact(
    'Atul singh',
    `https://www.translense.com/`,
    'atul.singh@translense.com',
  )
  //.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
  .addBasicAuth({ type: 'http', scheme: 'basic' })
  .addServer('http://localhost:4000/', 'Dev Server')
  .addServer('http://35.207.233.61:4000/', 'Staging Server')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
  .build();

export const clientSwaggerConfig = new DocumentBuilder()
  .setTitle('Styler developed by Translense Private Limited')
  .setDescription('Styler Client Api')
  .setVersion('1.0.0')
  .setTermsOfService(
    'The API developed and maintained by Translense Private Limited is the sole property of Translense Private Limited, and unauthorized access or use is strictly prohibited. Such unauthorized access may lead to legal ramifications. Access to the API is granted solely to those who have obtained explicit permission from Translense Private Limited through official channels. Prohibited activities include attempting to bypass security measures or using the API for illegal purposes. Translense Private Limited reserves the right to enforce these terms through legal means and may modify them at its discretion. Users are responsible for regularly reviewing the terms for any updates.',
  )
  .setContact(
    'Atul singh',
    `https://www.translense.com/`,
    'atul.singh@translense.com',
  )
  .addServer('http://localhost:4000/', 'Dev Server')
  .addServer('http://35.207.233.61:4000/', 'Staging Server')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
  .build();

export const customerSwaggerConfig = new DocumentBuilder()
  .setTitle('Styler developed by Translense Private Limited')
  .setDescription('Styler Customer Api')
  .setVersion('1.0.0')
  .setTermsOfService(
    'The API developed and maintained by Translense Private Limited is the sole property of Translense Private Limited, and unauthorized access or use is strictly prohibited. Such unauthorized access may lead to legal ramifications. Access to the API is granted solely to those who have obtained explicit permission from Translense Private Limited through official channels. Prohibited activities include attempting to bypass security measures or using the API for illegal purposes. Translense Private Limited reserves the right to enforce these terms through legal means and may modify them at its discretion. Users are responsible for regularly reviewing the terms for any updates.',
  )
  .setContact(
    'Atul singh',
    `https://www.translense.com/`,
    'atul.singh@translense.com',
  )
  .addServer('http://localhost:4000/', 'Dev Server')
  .addServer('http://35.207.233.61:4000/', 'Staging Server')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
  .build();