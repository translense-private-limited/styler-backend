import { Controller, Get, Param } from "@nestjs/common";
import { RoleClientService } from "../services/role-client.service";
import { RoleEntity } from "../entities/role.entity";
import { ApiTags } from "@nestjs/swagger";

@Controller('client')
@ApiTags('Client/Roles')
export class RoleClientController {
    constructor(
        private readonly roleClientService:RoleClientService
  ) {}


    @Get('role')
    async getAllSystemDefinedRoles():Promise<RoleEntity[]>{
        return await this.roleClientService.getAllSystemDefinedRoles()
    }

    @Get('role/custom/:outletId')
    async getAllCustomRoles(
        @Param('outletId') outletId:number
    ):Promise<RoleEntity[]>{
        return await this.roleClientService.getAllCustomRoles(outletId)
    }   

    @Get('role/:outletId')
    async getAllRoles(
        @Param('outletId') outletId:number
    ):Promise<{ custom: RoleEntity[]; systemDefined: RoleEntity[] }>
    {
        return await this.roleClientService.getAllRoles(outletId)
    }

}