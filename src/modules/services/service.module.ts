import { getMongodbDataSource } from "@modules/database/data-source";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {Service, ServiceSchema} from './schema/service.schema'
import { ServiceController } from "./controllers/service.controller";
import { ServiceService } from "./services/service.service";
import { ServiceRepository } from "./repositories/service.repository";

@Module({
    imports: [
        MongooseModule.forFeature([ {name: Service.name, schema: ServiceSchema} ], getMongodbDataSource())
    ],
    exports: [],
    providers: [ServiceService, ServiceRepository],
    controllers: [ServiceController]
})
export class ServiceModule{}