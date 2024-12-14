import { ClientRepository } from "@modules/client/client/repository/client.repository";
import { Injectable } from "@nestjs/common";
import { GenderEnum } from "@src/utils/enums/gender.enums";

@Injectable()
export class SeedClientData{
    constructor(private readonly clientRepository:ClientRepository){}

    async seedClients():Promise<void>{
            const queryRunner = this.clientRepository.getRepository().manager.connection.createQueryRunner();
        try{
            await queryRunner.startTransaction();

            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
            await queryRunner.query('TRUNCATE TABLE client;');
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
      
            const clients = [
                {
                    name:'Sample Outlet Client',
                    email:'client@translense.com',
                    password:'$2b$10$We.1TuspN0s/OCg5UgkIte6s8aPreGZGpqXOcrDOze2hgKfLko8kC',
                    contactNumber:'1234567890',
                    roleId:21,
                    gender:GenderEnum.MALE,
                    pastExperience:5,
                    about: 'Experienced professional',
                    outletId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            await this.clientRepository.getRepository().save(clients);
            await queryRunner.commitTransaction();
            console.log('client table seeding completed')
        }
        catch(error){
            await queryRunner.rollbackTransaction();
            console.error('Error during client table seeding:',error);
            throw error;
        }finally {
            await queryRunner.release();
          }
    }
}