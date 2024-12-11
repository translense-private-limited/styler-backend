import { CreateOutletDto } from './outlet.dto';
import { IsOptional } from 'class-validator';
import { AddressDto } from '@src/utils/dtos/address.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateOutletDto extends OmitType(CreateOutletDto, ['addressId', 'address'] as const)  {
    @IsOptional()
    address?: Partial<AddressDto>;
}
