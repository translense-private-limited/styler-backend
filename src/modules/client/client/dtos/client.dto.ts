import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @Length(1, 255, { message: 'Name must be between 1 and 255 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Length(6, 255, { message: 'Password must be at least 6 characters long' })
  password: string;
}
