import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { RegisterClientDto } from '@modules/client/client/dtos/register-client.dto';
import { CreateOutletDto } from './outlet.dto';

export class CreateOutletWithClientDto {
  @ValidateNested()
  @Type(() => RegisterClientDto)
  client: RegisterClientDto;

  @ValidateNested()
  @Type(() => CreateOutletDto)
  outlet: CreateOutletDto;

  // @ValidateNested()
  // @Type(()=>AddressDto)
  // address: AddressDto
}
