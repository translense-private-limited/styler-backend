import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AdminSignUpDto{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    @IsString()
    password:string;
}