import { RoleEntity } from "@modules/authorization/entities/role.entity";
import { ClientEntity } from "../entities/client.entity";

export class AllTeamMembers{
    client:ClientEntity[];
    role:RoleEntity[];
}