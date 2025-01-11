import { Body, Controller, Get, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ExtendedClient } from "../dtos/extended-client.dto";
import { ClientAdminService } from "../services/client-admin.service";

@ApiTags('Admin/Client')
@Controller('admin')
export class ClientAdminController{
    constructor(
        private readonly clientAdminService:ClientAdminService,
    ){}

    @Get('/outlet/:outletId/employees')
    async getAllEmployeesForOutlet(
        @Param('outletId',ParseIntPipe) outletId:number
    ):Promise<ExtendedClient[]>{
        return this.clientAdminService.getAllEmployeesForOutlet(outletId)
    }

    @Get('employees/:employeeId')
    async getEmployeeDetailsById(
        @Param('employeeId',ParseIntPipe) employeeId:number
    ):Promise<ExtendedClient>{
        return this.clientAdminService.getEmployeeDetailsByIdOrThrow(employeeId);
    }

    @Patch('employees/:employeeId')
    async updateEmployeeDetails(
      @Param('employeeId', ParseIntPipe) employeeId: number,
      @Body() updateEmployeeDto: Partial<ExtendedClient>,
    ): Promise<ExtendedClient> {
      return await this.clientAdminService.updateEmployeeDetails(
        employeeId,
        updateEmployeeDto,
      );
    }
}