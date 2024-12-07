import { IsBoolean, IsNotEmpty } from 'class-validator';

export class DeleteOutletDto {
  @IsNotEmpty()
  @IsBoolean()
  confirmation: boolean;  // Confirmation flag
}
