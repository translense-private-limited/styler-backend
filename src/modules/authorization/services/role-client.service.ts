import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../entities/role.entity";
import { RoleRepository } from "../repositories/role.repository";
import { roles } from "../enums/roles.enum";

@Injectable()
export class RoleClientService{
    constructor(
        private readonly roleRepository:RoleRepository,
    ){}

    async getAllSystemDefinedRoles():Promise<RoleEntity[]>{
        return await this.roleRepository.getRepository()
        .find(
            {where:
                {isSystemDefined:true,keyScope:roles.CLIENT}
            }
        )
    }

    async getAllCustomRoles(outletId:number):Promise<RoleEntity[]>{
        return await this.roleRepository.getRepository()
        .find(
            {where:
                {isSystemDefined:false,outletId:outletId,keyScope:roles.CLIENT}
            }
        )
    }

    async getAllRoles(outletId:number):Promise<{custom:RoleEntity[],systemDefined:RoleEntity[]}>{
        return {
            custom: await this.getAllCustomRoles(outletId),
            systemDefined: await this.getAllSystemDefinedRoles(),
        }
    }
}