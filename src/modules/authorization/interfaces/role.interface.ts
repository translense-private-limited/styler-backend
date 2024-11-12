import { UserType } from "../enums/usertype.enum";

export interface RoleInterface {
  name: string;
  isSystemDefined?: boolean;
  scope:UserType;
  outletId:number;
}
