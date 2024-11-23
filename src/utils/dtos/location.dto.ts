import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber()
  @Type(() => Number)
  latitude: number; // Latitude of the user's location

  @IsNumber()
  @Type(() => Number)
  longitude: number; // Longitude of the user's location
}
