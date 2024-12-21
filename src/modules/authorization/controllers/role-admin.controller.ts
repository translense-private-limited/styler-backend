import { Controller, Get, Param } from "@nestjs/common";
import { RoleClientService } from "../services/role-client.service";
import { SystemAndCustomRolesDto } from "../dtos/system-custom-roles.dto";

@Controller('admin')
export class RoleAdminCOntroller{
    constructor(private readonly roleClientService: RoleClientService) {}

    @Get('role/:outletId')
    async getAllRoles(
      @Param('outletId') outletId: number,
    ): Promise<SystemAndCustomRolesDto> {
      return this.roleClientService.getAllRoles(outletId);
    }
}