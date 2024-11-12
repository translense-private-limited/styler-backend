import { GenderEnum } from '@src/utils/enums/gender.enums';
export interface ServiceInterface {
  categoryId: string;
  gender: GenderEnum;
  serviceName: string;
  type: string;
  price: number;
  timeTaken: number;
  about: string;
  description: string;
}
