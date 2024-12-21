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
                name: "Luxury Hair Studio",
                description: "A high-end salon specializing in advanced hair treatments and styling services.",
                status: OutletStatusEnum.LIVE,
                addressId: 1,
                latitude: 40.712776,
                longitude: -74.005974,
                phoneNumber: "+11234567890",
                email: "luxury@salonscape.com",
                website: "http://www.luxuryhairstudio.com",
                createdAt: new Date(),
                updatedAt: new Date(),
                clientId: 1,
              },
              {
                id: 2,
                name: "Urban Chic Salon",
                description: "A trendy salon offering modern cuts, colors, and grooming services for urban lifestyles.",
                status: OutletStatusEnum.COMING_SOON,
                addressId: 2,
                latitude: 34.052235,
                longitude: -118.243683,
                phoneNumber: "+19876543210",
                email: "urban@salonscape.com",
                website: "http://www.urbanchicsalon.com",
                createdAt: new Date(),
                updatedAt: new Date(),
                clientId: 2,
              },
              ];

              await this.outletRepository.getRepository().save(outlets);
              await queryRunner.commitTransaction();

        }catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
          }finally {
            await queryRunner.release();
          }
    }
}