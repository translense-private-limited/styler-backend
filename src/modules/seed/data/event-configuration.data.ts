import { Injectable } from "@nestjs/common";
import { EventConfigurationRepository } from "@src/utils/notification/repositories/event-configuration.repository";
import { EventConfigurationEntity } from "@src/utils/notification/entities/even-configuration.entity";
import { EventNameEnum } from "@src/utils/notification/enums/event-name.enum";
import { UserTypeEnum } from "@modules/authorization/enums/user-type.enum";
import { NotificationTypeEnum } from "@src/utils/notification/enums/notification-type.enum";

@Injectable()
export class SeedEventConfigurationData {
    constructor(private readonly eventConfigurationRepository: EventConfigurationRepository) {}

    async seedEventConfigurations(): Promise<void> {
        const queryRunner = this.eventConfigurationRepository.getRepository().manager.connection.createQueryRunner();
        try {
            await queryRunner.startTransaction();

            // Disable foreign key checks and truncate the table
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
            await queryRunner.query('TRUNCATE TABLE event_configuration_entity;');
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

            // Seed data
            const eventConfigurations: Partial<EventConfigurationEntity>[] = [
                {
                    id: 1,
                    eventName: EventNameEnum.ORDER_PLACED,
                    targetUser: [UserTypeEnum.CUSTOMER],
                    targetClientRoles: [], // Empty array for `simple-array` column
                    notificationType: [NotificationTypeEnum.EMAIL, NotificationTypeEnum.SMS],
                    emailTemplate: {
                        subject: "Order Confirmation", 
                        body: "Hello {{name}}, your order was <h1>placed</h1>",
                    },                    smsTemplate: 'Your order has been placed successfully!',
                    pushNotificationTemplate: null,
                    createdAt: new Date('2024-12-25 11:33:17.00'),
                    updatedAt: new Date('2024-12-25 20:20:35.67'),
                },
            ];

            await this.eventConfigurationRepository.getRepository().save(eventConfigurations);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
