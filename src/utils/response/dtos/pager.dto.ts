import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PagerDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  pageNumber?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  perPage?: number;
}
