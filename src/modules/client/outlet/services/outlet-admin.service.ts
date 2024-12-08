import { throwIfNotFound } from "@src/utils/exceptions/common.exception";
import { DeleteOutletDto } from "../dtos/delete-outlet.dto";
import { OutletRepository } from "../repositories/outlet.repository";
import { OutletService } from "./outlet.service";
import { ClientRepository } from "@modules/client/client/repository/client.repository";
import { ClientOutletMappingRepository } from "@modules/admin/client-outlet-mapping/repositories/client-outlet-mapping.repository";
import { Injectable } from "@nestjs/common";
import { CreateOutletWithClientDto } from "../dtos/outlet-client.dto";
import { OutletEntity } from "../entities/outlet.entity";
import { RoleEnum } from "@src/utils/enums/role.enums";
import { RoleExternalService } from "@modules/authorization/services/role-external.service";
import { ClientEntity } from "@modules/client/client/entities/client.entity";
import { ClientOutletMappingEntity } from "@modules/admin/client-outlet-mapping/entities/client-outlet-mapping.entity";
import { OutletStatusEnum } from "../enums/outlet-status.enum";
import { ClientExternalService } from "@modules/client/client/services/client-external.service";
import { RegisterClientDto } from "@modules/client/client/dtos/register-client.dto";

@Injectable()
export class OutletAdminService{
    constructor(
        private readonly outletRepository:OutletRepository,
        private readonly outletService:OutletService,
        private readonly clientRepository:ClientRepository,
        private readonly clientOutletMappingRepository:ClientOutletMappingRepository,
        private readonly roleExternalService:RoleExternalService,
        private readonly clientExternalService:ClientExternalService
    ){}

    async createOutletWithClient(createOutletWithClientDto: CreateOutletWithClientDto) {
        const { client, outlet } = createOutletWithClientDto;
    
        // Start a transaction
        const queryRunner = this.clientRepository.getRepository().manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
    
        try {
          // Step 1: Create the outlet
          const newOutlet = await queryRunner.manager.save(OutletEntity, outlet);
    
          // Step 2: Get the role for the client
          const role = await this.roleExternalService.getRoleDetails(RoleEnum.OWNER);
          client.roleId = role.id;
    
          // Set the outletId on the client
          client.outletId = newOutlet.id;
          const newClient = await queryRunner.manager.save(ClientEntity, client);
    
          // Step 3: Create a mapping between the client and the outlet
          const clientOutletMapping = {
            clientId: newClient.id,
            outletId: newOutlet.id
          };
          await queryRunner.manager.save(ClientOutletMappingEntity, clientOutletMapping);
    
          // Step 4: Update the outlet with the clientId if not already set
          newOutlet.clientId = newClient.id;
          await queryRunner.manager.save(OutletEntity, newOutlet);
    
          // Commit transaction
          await queryRunner.commitTransaction();
    
          return {
            message: 'Outlet and Client created successfully',
            outlet: newOutlet,
            client: newClient,
          };
        } catch (error) {
          // If any error occurs, rollback the transaction
          await queryRunner.rollbackTransaction();
          throw error;
        } finally {
          // Release the query runner
          await queryRunner.release();
        }
      }

    async deleteOutletByIdOrThrow(outletId: number, deleteOutletDto: DeleteOutletDto): Promise<string> {
        // Ensure confirmation is provided for deletion
        if (!deleteOutletDto.confirmation) {
            throw new Error('Confirmation is required to delete the outlet.');
        }
    
        // Fetch the outlet to be deleted
        const outlet = await this.outletService.getOutletByIdOrThrow(outletId)
        throwIfNotFound(outlet, `Outlet with ID ${outletId} not found`);
    
        // Fetch the clients associated with this outlet from the ClientOutletMapping table
        const clientOutletMappings = await this.clientOutletMappingRepository.getRepository().find({
            where: { outletId: outletId },
        });
    
        // If there are clients associated with this outlet, delete them from the ClientEntity
        if (clientOutletMappings.length > 0) {
            for (const mapping of clientOutletMappings) {
                // Delete the client associated with the outlet
                const client = await this.clientRepository.getRepository().findOne({
                    where: { id: mapping.clientId },
                });
                if (client) {
                    await this.clientRepository.getRepository().remove(client);
                }
                // Delete the mapping from ClientOutletMapping
                await this.clientOutletMappingRepository.getRepository().remove(mapping);
            }
        }
        await this.outletRepository.getRepository().remove(outlet);
    
        return "Outlet and associated clients deleted successfully";
    }

    async getAllOutlets():Promise<OutletEntity[]>{
        return this.outletService.getAllOutlets();
    }
    
    async updateOutletByIdOrThrow(outletId: number, updateData: Partial<OutletEntity>): Promise<OutletEntity> {
        const outlet = await this.outletService.getOutletByIdOrThrow(outletId)
    
        //throw exception if outlet not found
        throwIfNotFound(outlet,`Outlet with ID ${outletId} not found`);
        console.log(updateData)
        // Merge the updateData with the existing outlet entity
        const updatedOutlet = Object.assign(outlet, updateData);
        console.log(updatedOutlet)
    
        return this.outletRepository.getRepository().save(updatedOutlet);
    }

    async updateOutletStatus(outletId: number, status: OutletStatusEnum): Promise<OutletEntity> {  
      const outlet = await this.outletService.getOutletByIdOrThrow(outletId);
      throwIfNotFound(outlet, `outlet not found`);
  
      outlet.status = status;  
      return await this.outletRepository.getRepository().save(outlet);
    }
    
    async addClientToAnExistingOutlet(outletId:number,registerClientDto:RegisterClientDto){
      //check if outlet exists
      await this.outletService.getOutletByIdOrThrow(outletId);
      const clientData = {
        ...registerClientDto,
        outletId,
      }
      return await this.clientExternalService.createClient(clientData)
    }
}