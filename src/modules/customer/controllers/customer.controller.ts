import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('customer')
@ApiTags('customer')
export class CustomerController {
  @Post('signup')
  async registerCustomer() {
    return 'running successfully';
  }

  @Post('login')
  async customerLogin() {
    return 'logged in successfully';
  }
}
