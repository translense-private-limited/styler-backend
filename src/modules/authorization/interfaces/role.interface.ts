import { UserTypeEnum } from "../enums/usertype.enum";

export interface RoleInterface {
  name: string;
  isSystemDefined?: boolean;
  scope: UserTypeEnum;
  outletId: number;
}
