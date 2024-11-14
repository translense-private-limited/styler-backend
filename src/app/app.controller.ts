import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AppService } from './app.service';

import { Public } from '@src/utils/decorators/public.decorator';
import { main } from '@src/utils/aws/aws-sdk';

@Controller()
@Public()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get('/heartbeat')
  getHeartbeat() {
    console.log();
    return {
      status: 'OK',
      message: 'Service is up and running....',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/pagination')
  getAllOutlet() {
    const pagerDto = {
      pageNumber: 1,
      pageSize: 5,
    };
    const data = [];
    return {
      status: HttpStatus.ACCEPTED,
      data,
      pagination: pagerDto,
    };
  }

  @Get('/error')
  getError() {
    throw new BadRequestException('invalid email');
  }

  @Get('aws')
  awsTest() {
    main();
  }
}
