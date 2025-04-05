import { ServiceInterface } from '@modules/client/services/interfaces/service.interface';

import { GenderEnum } from '@src/utils/enums/gender.enums';
import { Types } from 'mongoose';

export class RatedServiceInterface implements ServiceInterface {
  categoryId: Types.ObjectId;
  gender: GenderEnum;
  serviceName: string;
  price: number;
  timeTaken: number;
  about: string;
  description?: string;
  outletId: number;
  rating: number;
  count: number;
}
