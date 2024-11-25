import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { getMongodbDataSource, getMysqlDataSource } from './data-source';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      logging: true,
      type: 'mysql',
      //  host: 'mysql', // uncomment it if you want to run via docker
      host: '127.0.0.1', // uncomment it if you want to run backend service independently
      port: 4001,
      name: getMysqlDataSource(), // 'mysql'
      username: 'user',
      password: 'root',
      database: 'styler',
      // eslint-disable-next-line no-undef
      entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
      synchronize: true,
      timezone: 'Z',
      migrationsRun: false,
    }),
    // MongoDB Connection using Mongoose
    MongooseModule.forRoot('mongodb://127.0.0.1:4002', {
      dbName: 'styler',
      user: 'root',
      pass: 'root',
      connectionName: getMongodbDataSource(), // MongoDB connection name
    }),
  ],
  exports: [TypeOrmModule],
  providers: [],
})
export class DatabaseModule {}
