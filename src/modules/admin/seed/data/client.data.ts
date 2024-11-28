import { ClientRepository } from "@modules/client/client/repository/client.repository";
import { Injectable } from "@nestjs/common";
import { GenderEnum } from "@src/utils/enums/gender.enums";

@Injectable()
export class clientData{
    constructor(private readonly clientRepository:ClientRepository){}

    async seedClients():Promise<void>{
        try{
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
                }
            ];

            await this.clientRepository.getRepository().save(clients);
            console.log('client table seeding completed')
        }
        catch(error){
            console.error('Error during client table seeding:',error);
            throw error;
        }
    }
}