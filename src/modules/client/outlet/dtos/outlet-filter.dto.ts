import { IsOptional, IsString, IsEnum, IsInt, Min, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { OutletStatusEnum } from '../enums/outlet-status.enum';


export class OutletFilterDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray()
  @IsEnum(OutletStatusEnum, {
    each:true,
    message: `Status must be one of: ${Object.values(OutletStatusEnum).join(', ')}`,
  })
  status?: OutletStatusEnum[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
