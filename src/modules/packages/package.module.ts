import { Module } from "@nestjs/common";
import { PackageRepository } from "./repositories/package.repository";
import { PackageService } from "./services/package.service";
import { PackageClientController } from "./controllers/package-client.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PackageModel, PackageSchema } from "./schema/package-schema";
import { getMongodbDataSource } from "@modules/database/data-source";
import { ServiceModel, ServiceSchema } from "@modules/client/services/schema/service.schema";
import { PackageClientService } from "./services/package-client.service";


@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: PackageSchema.name, schema: PackageModel },
            { name: ServiceSchema.name, schema: ServiceModel }],
            getMongodbDataSource(),
        ),
    ],
    providers: [
        PackageRepository, PackageService, PackageClientService,
    ],
    controllers: [PackageClientController],
    exports: [],
})
export class PackageModule { }
