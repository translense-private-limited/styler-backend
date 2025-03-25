import { GenderEnum } from '@src/utils/enums/gender.enums';

export interface ClientInterface {
  name: string;
  email: string;
  password?: string;
  contactNumber: string;
  dateOfBirth?: Date;
  // roleId: number;
  gender: GenderEnum;
  pastExperience?: number;
  about?: string;
  outletId?: number;
}

