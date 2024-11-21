import { GenderEnum } from '@src/utils/enums/gender.enums';

export interface CustomerInterface {
  name: string;
  email: string;
  contactNumber: number;
  password: string;
  gender?: GenderEnum;
}
