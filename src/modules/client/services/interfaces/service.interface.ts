import { Gender } from '@src/utils/enums/gender.enums';
export interface serviceInterface {
  categoryId: string;
  gender: Gender;
  serviceName: string;
  type: string;
  price: number;
  timeTaken: number;
  about: string;
  description: string;
}
