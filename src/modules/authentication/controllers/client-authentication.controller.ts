import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SellerAuthService } from '../services/seller-auth.service';
import { SellerLoginDto } from '../dtos/seller-login.dto';
import { Response } from 'express';

import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/utils/decorators/public.decorator';

@Controller('client')
@ApiTags('Auth')
export class ClientAuthController {
  constructor(private clientAuthService: SellerAuthService) {}

  @Post('login')
  @Public()
  @ApiBody({
    description: 'Client Login',
    schema: {
      example: {
        username: 'client@translense.com',
        password: 'password',
      },
    },
  })
  async login(
    @Body() clientLoginDto: SellerLoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { seller, jwtToken } =
        await this.clientAuthService.login(clientLoginDto);
      res.setHeader('token', jwtToken); // Use setHeader to add the token
      return res.status(HttpStatus.OK).json({ ...seller, token: jwtToken }); // Correctly return status and JSON
    } catch (error) {
      throw new UnauthorizedException('Invalid Credentials', error.message);
    }
  }
}
