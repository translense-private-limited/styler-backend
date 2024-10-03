import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserTypeInterface } from '../interfaces/user-type.interface';
import { UserEnum } from '../enums/user.enum';
import { LoginDto } from './login.dto';

export class SellerLoginDto extends LoginDto   {
 
}
