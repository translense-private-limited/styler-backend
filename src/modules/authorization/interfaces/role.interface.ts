import { UserTypeEnum } from '../../../utils/enums/user-type.enum';

export interface RoleInterface {
  name: string;
  isSystemDefined?: boolean;
  scope: UserTypeEnum;
  outletId: number;
}
