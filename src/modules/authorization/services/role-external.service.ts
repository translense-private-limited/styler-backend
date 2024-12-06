import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../entities/role.entity";
import { RoleRepository } from "../repositories/role.repository";

@Injectable()
export class RoleExternalService {
    constructor(
        private readonly roleRepository:RoleRepository
    ){}

    async getRoleDetails(roleName:string):Promise<RoleEntity>{
        const role  = await this.roleRepository.getRepository().findOne({where:{name:roleName}});
        return role;
    }
}