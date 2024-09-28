import { BadRequestException, Controller, Get, HttpException, HttpStatus, Logger, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { SuccessResponse } from '../utils/response/interfaces/success-response.interface';
import { ResponseHandler } from '../utils/response/response-handler';

import { Public } from '@src/utils/decorators/public.decorator';
import { Request } from 'express'; // Import the Request type from express



@Controller()
@Public()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,

  ) { }

  @Get('/heartbeat')
  getHeartbeat() {
    console.log()
    return {
      status: 'OK',
      message: 'Service is up and running',
      timestamp: new Date().toISOString()
    };
  }

  @Get('/pagination')
  getAllOutlet() {
    const pagerDto = {
      pageNumber: 1,
      pageSize: 5
    }
    const data = []
    return {
      status: HttpStatus.ACCEPTED,
      data,
      pagination: pagerDto
    }

  }

  @Get('/error')
  getError() {
    throw new BadRequestException('invalid email')
  }
}
