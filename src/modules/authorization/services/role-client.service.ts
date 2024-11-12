import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../entities/role.entity";
import { RoleRepository } from "../repositories/role.repository";
import { UserType } from "../enums/usertype.enum";
import { ReturnRolesTypeDTO } from "../dtos/return-role.dto";

@Injectable()
export class RoleClientService{
    constructor(
        private readonly roleRepository:RoleRepository,
    ){}

    async getAllSystemDefinedRoles():Promise<RoleEntity[]>{
        return await this.roleRepository.getRepository()
        .find(
            {where:
                {isSystemDefined:true,Scope:UserType.CLIENT}
            }
        )
    }

    async getAllCustomRoles(outletId:number):Promise<RoleEntity[]>{
        return await this.roleRepository.getRepository()
        .find(
            {where:
                {isSystemDefined:false,outletId:outletId,Scope:UserType.CLIENT}
            }
        )
    }

    async getAllRoles(outletId:number):Promise<ReturnRolesTypeDTO>{
        return {
            custom: await this.getAllCustomRoles(outletId),
            systemDefined: await this.getAllSystemDefinedRoles(),
        }
    }
}