import { IsOptional, IsString } from 'class-validator';
import { PagerDto } from './pager.dto';

export class PaginatedSearchDto extends PagerDto {
  // @IsNumber()
  // @Min(1)
  // @IsOptional()
  // pageNumber?: number;

  // @IsNumber()
  // @Min(1)
  // @Max(100)
  // @IsOptional()
  // perPage?: number;

  @IsString()
  @IsOptional()
  searchTerm?: string;
}
