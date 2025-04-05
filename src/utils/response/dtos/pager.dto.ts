import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PagerDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number) // :point_left: Transform string to number
  pageNumber?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number) // :point_left: Transform string to number
  perPage?: number;
}
