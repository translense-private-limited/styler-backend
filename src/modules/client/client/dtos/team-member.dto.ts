import { ClientEntity } from "../entities/client.entity";
import { RoleEntity } from "@modules/authorization/entities/role.entity";

export class TeamMember{

    client:ClientEntity;
    password?:string;
    role:RoleEntity;
}