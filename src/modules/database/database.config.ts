import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { getMysqlDataSource } from './data-source';

dotenv.config(); // Load environment variables

export const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 4001,
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'styler',
  name: getMysqlDataSource(),
  logging: true,
  timezone: 'Z',
  // eslint-disable-next-line no-undef
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  synchronize: true,
  migrationsRun: false,
  migrations: ['dist/db/migrations/*.js'],
};
