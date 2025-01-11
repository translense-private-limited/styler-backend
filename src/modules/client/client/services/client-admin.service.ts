import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ExtendedClient } from "../dtos/extended-client.dto";
import { ClientEntity } from "../entities/client.entity";
import { ExtendedClientService } from "./extended-client.service";
import { ClientService } from "./client.service";
import { ClientRepository } from "../repository/client.repository";

@Injectable()
export class ClientAdminService{
    constructor(
        private readonly extendedClientService:ExtendedClientService,
        private readonly clientService:ClientService,
        private readonly clientRepository:ClientRepository
    ){}

    async getAllEmployeesForOutlet(outletId:number):Promise<ExtendedClient[]>{
        return this.clientService.getAllExtendedClientsForOutlet(outletId);
    }

    async getEmployeeDetailsByIdOrThrow(
        employeeId: number,
      ): Promise<ExtendedClient> {
        try {
          return await this.clientRepository.getClientDetails(employeeId);
          
        } catch (error) {
    
          throw new HttpException(
            'An unexpected error occurred.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

    async updateEmployeeDetails(
        employeeId: number,
        updateDto: Partial<ClientEntity>,
      ): Promise<ExtendedClient> {
        return this.extendedClientService.updateExtendedClient(employeeId,updateDto);
      }
    
}