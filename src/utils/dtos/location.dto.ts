import { IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber()
  latitude: number; // Latitude of the user's location

  @IsNumber()
  longitude: number; // Longitude of the user's location
}
