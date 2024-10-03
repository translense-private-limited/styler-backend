import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateOwnerDto {
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @Length(6, 255)
    password: string;
}
