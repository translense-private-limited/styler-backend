import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginatedSearchDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  pageNumber?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  perPage?: number;

  @IsString()
  @IsOptional()
  searchTerm?: string;
}
