import { LocationDto } from '@src/utils/dtos/location.dto';

export class NearbyOutletDto extends LocationDto {
  radius?: number = 5; // Default value of 5
}
