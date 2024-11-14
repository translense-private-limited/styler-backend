import { RoleEntity } from "@modules/authorization/entities/role.entity";
import { ClientEntity } from "../entities/client.entity";

export class TeamMemberWithRole {
  client: ClientEntity;
  role: RoleEntity;
}

export class AllTeamMembers {
  teamMembers: TeamMemberWithRole[];
}
