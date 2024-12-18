import { Body, Controller, Get, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TeamMember } from "../dtos/team-member.dto";
import { ClientAdminService } from "../services/client-admin.service";

@ApiTags('Admin/Client')
@Controller('admin')
export class ClientAdminController{
    constructor(
        private readonly clientAdminService:ClientAdminService
    ){}

    @Get('employees/outlet/:outletId')
    async getAllEmployeesForOutlet(
        @Param('outletId',ParseIntPipe) outletId:number
    ):Promise<TeamMember[]>{
        return this.clientAdminService.getAllEmployeesForOutlet(outletId)
    }

    @Get('employees/:employeeId')
    async getEmployeeDetailsById(
        @Param('employeeId',ParseIntPipe) employeeId:number
    ):Promise<TeamMember>{
        return this.clientAdminService.getEmployeeDetailsByIdOrThrow(employeeId);
    }

    @Patch('employees/:employeeId')
    async updateEmployeeDetails(
      @Param('employeeId', ParseIntPipe) employeeId: number,
      @Body() updateEmployeeDto: Partial<TeamMember>,
    ): Promise<TeamMember> {
      return await this.clientAdminService.updateEmployeeDetails(
        employeeId,
        updateEmployeeDto,
      );
    }
}