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
                      name: 'John Doe',
                      email:'client@translense.com',
                      password:'$2b$10$We.1TuspN0s/OCg5UgkIte6s8aPreGZGpqXOcrDOze2hgKfLko8kC',
                      contactNumber: '9876543210',
                      roleId: 21,
                      gender: GenderEnum.MALE,
                      pastExperience: 8,
                      about: 'Seasoned hairstylist with expertise in advanced hair treatments.',
                      outletId: 1,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                    {
                      name: 'Jane Smith',
                      email: 'client2@translense.com',
                      password:'$2b$10$We.1TuspN0s/OCg5UgkIte6s8aPreGZGpqXOcrDOze2hgKfLko8kC',
                      contactNumber: '9123456789',
                      roleId: 21,
                      gender: GenderEnum.FEMALE,
                      pastExperience: 5,
                      about: 'Creative stylist specializing in modern cuts and colors.',
                      outletId: 2,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  ];

            await this.clientRepository.getRepository().save(clients);
            await queryRunner.commitTransaction();
        }
        catch(error){
            await queryRunner.rollbackTransaction();
            throw error;
        }finally {
            await queryRunner.release();
          }
    }
}