import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TeamMember } from "../dtos/team-member.dto";
import { RoleClientService } from "@modules/authorization/services/role-client.service";
import { ClientEntity } from "../entities/client.entity";
import { TeamMemberService } from "./team-member.service";
import { ClientService } from "./client.service";
import { ClientRepository } from "../repository/client.repository";

@Injectable()
export class ClientAdminService{
    constructor(
        private readonly roleClientService:RoleClientService,
        private readonly teamMemberService:TeamMemberService,
        private readonly clientService:ClientService,
        private readonly clientRepository:ClientRepository
    ){}

    async getAllEmployeesForOutlet(outletId:number):Promise<TeamMember[]>{
        return this.clientService.getAllTeamMembersForOutlet(outletId);
    }

    async getEmployeeDetailsByIdOrThrow(
        employeeId: number,
      ): Promise<TeamMember> {
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
      ): Promise<TeamMember> {
        return this.teamMemberService.updateTeamMember(employeeId,updateDto);
      }
    
}