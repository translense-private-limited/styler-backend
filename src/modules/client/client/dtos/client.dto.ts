import { Gender } from '@src/utils/enums/gender.enums';
import { IsEmail, IsNotEmpty, IsOptional, Length,Matches } from 'class-validator';
import { clientInterface } from '../interfaces/client.interface';

export class CreateClientDto implements clientInterface {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @Length(1, 255, { message: 'Name must be between 1 and 255 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsOptional()
  password: string;

  @IsNotEmpty({ message: 'Contact number should not be empty' })
  @Length(10, 15, { message: 'Contact number must be between 10 to 15 digits' })
  @Matches(/^\d+$/, { message: 'Contact number must contain only digits' })
  contactNumber: string;


  @IsNotEmpty({message:'role should not be empty'})
  roleId:number;

  @IsNotEmpty({message:'Gender should not be empty'})
  gender:Gender;

  @IsOptional()
  pastExperience?:number;

  @IsOptional()
  about?:string;

  @IsOptional()
  outletId?:number;
}
