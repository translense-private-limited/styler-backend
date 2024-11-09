import { IsNumber } from 'class-validator';
import { ClientIdDtoInterface } from '../interfaces/client-id.interface';

export class ClientIdDto implements ClientIdDtoInterface {
  @IsNumber()
  clientId!: number;

  @IsNumber()
  whitelabelId!: number;

  @IsNumber()
  outletIds!: number[];
}
