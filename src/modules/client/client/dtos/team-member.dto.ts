import { ClientEntity } from '../entities/client.entity';
import { RoleEntity } from '@modules/authorization/entities/role.entity';

// export class TeamMember{

//     client:ClientEntity;
//     password?:string;
//     role:RoleEntity;
// }

import { OmitType } from '@nestjs/mapped-types';

/**
 * The `X` class extends `ClientEntity` but excludes the `roleId` field and adds a `role` field.
 */
export class TeamMember extends OmitType(ClientEntity, ['roleId','profilePhoto'] as const) {
  /**
   * The role entity assigned to the client, representing the client's role within the application.
   */
  role: RoleEntity;
}
