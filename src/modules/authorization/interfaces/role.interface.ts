import { roles } from "../enums/roles.enum";

export interface RoleInterface {
  name: string;
  isSystemDefined?: boolean;
  keyScope:roles;
  outletId:number;
}
