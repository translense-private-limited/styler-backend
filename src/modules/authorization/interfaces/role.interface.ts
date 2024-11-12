import { UserType } from "../enums/usertype.enum";

export interface RoleInterface {
  name: string;
  isSystemDefined?: boolean;
  Scope:UserType;
  outletId:number;
}
