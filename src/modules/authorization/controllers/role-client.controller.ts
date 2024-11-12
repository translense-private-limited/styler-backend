import { Controller, Get, Param } from "@nestjs/common";
import { RoleClientService } from "../services/role-client.service";
import { RoleEntity } from "../entities/role.entity";
import { ApiTags } from "@nestjs/swagger";
import { SystemAndCustomRolesDto } from "../dtos/system-custom-roles.dto";

@Controller('client')
@ApiTags('Client/Role')
export class RoleClientController {
    constructor(
        private readonly roleClientService:RoleClientService
  ) {}


    @Get('role')
    async getAllSystemDefinedRoles():Promise<RoleEntity[]>{
        return this.roleClientService.getAllSystemDefinedRoles()
    }

    @Get('role/custom/:outletId')
    async getAllCustomRoles(
        @Param('outletId') outletId:number
    ):Promise<RoleEntity[]>{
        return this.roleClientService.getAllCustomRoles(outletId)
    }   

    @Get('role/:outletId')
    async getAllRoles(
        @Param('outletId') outletId:number
    ):Promise<SystemAndCustomRolesDto>
    {
        return this.roleClientService.getAllRoles(outletId)
    }

}