import { IsNotEmpty } from 'class-validator';

export class UpdateKeysDto {
    
  @IsNotEmpty()
  outletId: number;
}
