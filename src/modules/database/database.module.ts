import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { getMongodbDataSource, getMysqlDataSource } from './data-source';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      logging: true,
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      name: getMysqlDataSource(), // 'mysql'
      username: 'user',
      password: 'root',
      database: 'styler',
      entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
      synchronize: true,
      timezone: 'Z',
      migrationsRun: false,
    }),
    TypeOrmModule.forRoot({
      name: getMongodbDataSource(), // Unique name for the MongoDB connection
      type: 'mongodb',
      url: 'mongodb://mongodb:27017/styler',
      synchronize: process.env.ENVIROMENT === 'development', // get rid of it soon as task optimisation
    }),
  ],
  exports: [],
  providers: [],
})
export class DatabaseModule { }
