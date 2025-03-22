import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@src/utils/decorators/public.decorator';
import { CustomerAuthenticationService } from '../services/customer-authentication.service';
import { CustomerLoginResponseInterface } from '../interfaces/customer-login-response.interface';
import { LoginDto } from '../dtos/login.dto';
import { CustomerSignupDto } from '../dtos/customer-signup.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('CustomerAuth')
@Controller('customer')
@Public()
export class CustomerAuthenticationController {
  constructor(
    private readonly customerAuthenticationService: CustomerAuthenticationService,
  ) { }

  @Post('signup')
  async registerCustomer(
    @Body() customerSignupDto: CustomerSignupDto,
  ): Promise<CustomerLoginResponseInterface> {
    return this.customerAuthenticationService.registerCustomer(
      customerSignupDto,
    );
  }

  @ApiBody({
    description: 'Customer Login',
    schema: {
      example: {
        username: 'customer@translense.com',
        password: 'password',
      },
    },
  })

  @Post('login')
  async loginCustomer(
    @Body() loginDto: LoginDto, // Use the DTO for validation
  ): Promise<CustomerLoginResponseInterface> {
    return this.customerAuthenticationService.customerLogin(loginDto);
  }

  @Post('signup/send-otp')
  async signupOtp(@Body() sendOtpDto: { username: string }): Promise<string> {
    return this.customerAuthenticationService.signupSendOtp(
      sendOtpDto.username,
    );
  }
}
