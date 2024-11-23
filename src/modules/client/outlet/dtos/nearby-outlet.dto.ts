import { LocationDto } from '@src/utils/dtos/location.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class NearbyOutletDto extends LocationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  radius?: number = 5; // Default value of 5
}
