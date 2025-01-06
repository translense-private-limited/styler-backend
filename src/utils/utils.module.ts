import { Module } from "@nestjs/common";
import { AddressRepository } from "./repositories/address.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressEntity } from "./entities/address.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { DeviceTokenRepository } from "./repositories/device-token.repository";
import { PushNotificationBuilderService } from "./services/push-notification-builder.service";
import { PushNotificationService } from "./services/push-notification.service";
import { DeviceTokenEntity } from "./entities/device-token.entity";
import { CustomerPushNotificationController } from "./controllers/customer-push-notification.controller";
import { ClientPushNotificationController } from "./controllers/client-push-notification.controller";
import { ClientModule } from "@modules/client/client/client.module";
import { AwsS3Controller } from "./aws/aws-s3.controller";
import { AwsS3Service } from "./aws/aws-s3.service";

@Module({
    imports:[TypeOrmModule.forFeature([AddressEntity,DeviceTokenEntity],getMysqlDataSource()),ClientModule],
    controllers:[ClientPushNotificationController,CustomerPushNotificationController,AwsS3Controller,AwsS3Controller],
    providers:[AddressRepository,DeviceTokenRepository,PushNotificationBuilderService,PushNotificationService,AwsS3Service],
    exports:[AddressRepository],
})

export class UtilsModule{}
