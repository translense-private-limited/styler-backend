import { Injectable } from "@nestjs/common";
import { ClientOutletMappingRepository } from "@modules/admin/client-outlet-mapping/repositories/client-outlet-mapping.repository";
@Injectable()
export class SeedClientOutletMappingData {
    constructor(private readonly clientOutletMappingRepository: ClientOutletMappingRepository) {}

    async seedClientOutletMappings(): Promise<void> {
        const queryRunner = this.clientOutletMappingRepository.getRepository().manager.connection.createQueryRunner();
        try {
            await queryRunner.startTransaction();

            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
            await queryRunner.query('TRUNCATE TABLE client_outlet_mapping;');
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

            const clientOutletMappings = [
                {
                    clientOutletMappingId:1,
                    clientId: 1,
                    outletId: 1,
                },
                {
                    clientOutletMappingId:2,
                    clientId: 2,
                    outletId: 2,
                },
            ];

            console.log("client-outlet-mapping seeding")
            await this.clientOutletMappingRepository.getRepository().save(clientOutletMappings);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
