import { OutletStatusEnum } from "@modules/client/outlet/enums/outlet-status.enum";
import { OutletRepository } from "@modules/client/outlet/repositories/outlet.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SeedOutletData{
    constructor( private readonly outletRepository:OutletRepository){}

    async seedOutlets():Promise<void>{
        const queryRunner = this.outletRepository.getRepository().manager.connection.createQueryRunner();

        try{

            await queryRunner.startTransaction();

            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
            await queryRunner.query('TRUNCATE TABLE outlets;');
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
      
            const outlets = [
                {
                  id: 1,
                  name: 'Sample Outlet',
                  description: 'This is a sample outlet description.',
                  status: OutletStatusEnum.UNDER_CONSTRUCTION,
                  address: '123 Main Street, City, Country',
                  latitude: 37.7749,
                  longitude: -122.4194,
                  phoneNumber: '+1234567890',
                  email: 'sample@translense.com',
                  website: 'http://www.sampleoutlet.com',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  clientId: 1,
                },
                {
                  id: 2,
                  name: 'Example Outlet',
                  description: 'This is an example outlet description.',
                  status: OutletStatusEnum.COMING_SOON,
                  address: '456 Another Street, City, Country',
                  latitude: 34.0522,
                  longitude: -118.2437,
                  phoneNumber: '+1987654321',
                  email: 'example@translense.com',
                  website: 'http://www.exampleoutlet.com',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  clientId: 2,
                },
              ];

              await this.outletRepository.getRepository().save(outlets);
              await queryRunner.commitTransaction();

              console.log('outlets table seeding completed');
        }catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error during outlets table seeding:', error);
            throw error;
          }finally {
            await queryRunner.release();
          }
    }
}