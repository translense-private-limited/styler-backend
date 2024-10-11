import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ServiceDto {
  @IsString()  // Ensures that 'name' is a string
  @IsNotEmpty()  // Ensures that 'name' is not empty
  name: string;

  @IsNumber()  // Ensures that 'price' is a number
  @IsNotEmpty()  // Ensures that 'price' is not empty
  price: number;
}
