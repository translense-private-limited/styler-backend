import { OutletStatusEnum } from "@modules/client/outlet/enums/outlet-status.enum";
import { OutletRepository } from "@modules/client/outlet/repositories/outlet.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class outletData{
    constructor( private readonly outletRepository:OutletRepository){}

    async seedOutlet():Promise<void>{
        try{
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
              console.log('outlets table seeding completed');
        }catch (error) {
            console.error('Error during outlets table seeding:', error);
            throw error;
          }
    }
}