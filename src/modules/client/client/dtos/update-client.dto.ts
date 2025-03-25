import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateClientDto } from './client.dto';
import { GenderEnum } from '@src/utils/enums/gender.enums';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  dateOfBirth?: Date;

  @IsEnum(GenderEnum)
  @IsOptional()
  gender?: GenderEnum;

  @IsNumber()
  @IsOptional()
  pastExperience?: number;

  @IsString()
  @IsOptional()
  about?: string;
}
