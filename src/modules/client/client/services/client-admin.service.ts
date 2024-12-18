import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TeamMember } from "../dtos/team-member.dto";
import { RoleClientService } from "@modules/authorization/services/role-client.service";
import { ClientRepository } from "../repository/client.repository";
import { ClientEntity } from "../entities/client.entity";
import { TeamMemberService } from "./team-member.service";
import { ClientService } from "./client.service";

@Injectable()
export class ClientAdminService{
    constructor(
        private readonly roleClientService:RoleClientService,
        private readonly teamMemberService:TeamMemberService,
        private readonly clientService:ClientService,
    ){}

    async getAllEmployeesForOutlet(outletId:number):Promise<TeamMember[]>{
        return this.clientService.getAllTeamMembersForOutlet(outletId);
    }

    async getEmployeeDetailsByIdOrThrow(
        employeeId: number,
      ): Promise<TeamMember> {
        try {
        
          const employee = await this.teamMemberService.getTeamMemberByIdOrThrow(employeeId) 
          const role = await this.roleClientService.getRoleByIdOrThrow(
            employee.roleId,
          );
          return { ...employee, role };
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