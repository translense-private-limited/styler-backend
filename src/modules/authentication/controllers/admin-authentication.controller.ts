import { Body, Post } from "@nestjs/common";
import { AdminSignUpDto } from "../dtos/admin-signup.dto";

export class AdminAuthenticationController{
    constructor(){}

    @Post('signup')
    async registerAdmin(
        @Body() adminSignUpDto:AdminSignUpDto
    ){
        return adminSignUpDto;
    }

}