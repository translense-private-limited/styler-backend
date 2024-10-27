import { IsNumber } from 'class-validator';

export class ClientOutletIdDto {
  @IsNumber()
  clientId: number;

  @IsNumber()
  outletId: number;
}
