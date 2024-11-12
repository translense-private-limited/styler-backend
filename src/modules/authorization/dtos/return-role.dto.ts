import { RoleEntity } from "../entities/role.entity";

export class ReturnRolesTypeDTO {
  custom: RoleEntity[];
  systemDefined: RoleEntity[];
}
