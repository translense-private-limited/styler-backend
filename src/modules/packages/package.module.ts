import { Module } from "@nestjs/common";
import { PackageRepository } from "./repositories/package.repository";
import { PackageService } from "./services/package.service";
import { PackageClientController } from "./controllers/package.client.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PackageModel, PackageSchema } from "./schema/package-schema";
import { getMongodbDataSource } from "@modules/database/data-source";


@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: PackageSchema.name, schema: PackageModel }],
            getMongodbDataSource(),
        ),
    ],
    providers: [
        PackageRepository, PackageService
    ],
    controllers: [PackageClientController],
    exports: [],
})
export class PackageModule { }
