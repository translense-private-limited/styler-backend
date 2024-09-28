// this setting is for migration
import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'mysql',
  host: '127.0.01',
  port: 4001,
  username: 'user',
  password: 'root',
  database: 'styler',
  logging: true,
  migrations: ['src/migrations/**/*{.ts,.js}'],
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
});
