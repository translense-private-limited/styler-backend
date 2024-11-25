import { GenderEnum } from '@src/utils/enums/gender.enums';
import { Types } from 'mongoose';
export interface ServiceInterface {
  categoryId: Types.ObjectId;
  gender: GenderEnum;
  serviceName: string;
  type: string;
  price: number;
  timeTaken: number;
  about: string;
  description: string;
  outletId: number;
}
