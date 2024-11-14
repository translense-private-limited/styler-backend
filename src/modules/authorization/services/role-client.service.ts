<<<<<<< HEAD
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
=======
import { Injectable, NotFoundException } from "@nestjs/common";
>>>>>>> clientTeamAPIs-preserved
import { RoleEntity } from "../entities/role.entity";
import { RoleRepository } from "../repositories/role.repository";
import { UserType } from "../enums/usertype.enum";
import { SystemAndCustomRolesDto } from "../dtos/system-custom-roles.dto";

@Injectable()
export class RoleClientService{
    constructor(
        private readonly roleRepository:RoleRepository,
    ){}

    async getAllSystemDefinedRoles():Promise<RoleEntity[]>{
        return await this.roleRepository.getRepository()
        .find(
            {where:
                {isSystemDefined:true,scope:UserType.CLIENT}
            }
        )
    }

    async getAllCustomRoles(outletId:number):Promise<RoleEntity[]>{
        return await this.roleRepository.getRepository()
        .find(
            {where:
                {isSystemDefined:false,outletId:outletId,scope:UserType.CLIENT}
            }
        )
    }

    async getAllRoles(outletId:number):Promise<SystemAndCustomRolesDto>{
        return {
            systemRoles: await this.getAllCustomRoles(outletId),
            customRoles: await this.getAllSystemDefinedRoles(),
        }
    }

<<<<<<< HEAD
    async getRoleById(roleId:number){
        const role =  await this.roleRepository.getRepository().findOne({where:{id:roleId}})
        if(!role) return new HttpException('role does not exist',HttpStatus.FORBIDDEN);
=======
    async getRoleByIdOrThrow(roleId:number):Promise<RoleEntity>{
        const role =  await this.roleRepository.getRepository().findOne({where:{id:roleId}})
        if(!role) throw new NotFoundException('role does not exist');
>>>>>>> clientTeamAPIs-preserved
        return role;
    }
}