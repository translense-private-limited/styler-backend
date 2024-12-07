import { Body, Controller, Post } from "@nestjs/common";
import { AdminSignupDto } from "../dtos/admin-signup.dto";
import { AdminLoginResponseInterface } from "../interfaces/admin-login-response.interface";
import { AdminAuthenticationService } from "../services/admin-auth.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Public } from "@src/utils/decorators/public.decorator";
import { LoginDto } from "../dtos/login.dto";

@ApiTags('AdminAuth')
@Controller('admin')
@Public()
export class AdminAuthenticationController{
    constructor(
        private adminAuthenticationService:AdminAuthenticationService
    ){}

    @Post('signup')
    async registerAdmin(
        @Body() adminSignUpDto:AdminSignupDto
    ):Promise<AdminLoginResponseInterface>{
        return this.adminAuthenticationService.registerAdmin(adminSignUpDto);
    }

    @Post('login')
    @ApiBody({
        description: 'Admin Login',
        schema: {
          example: {
            username: 'Admin@translense.com',
            password: 'password',
          },
        },
      })
    async loginAdmin(
        @Body() loginDto:LoginDto
    ):Promise<AdminLoginResponseInterface>{
        return this.adminAuthenticationService.adminLogin(loginDto);
    }
}