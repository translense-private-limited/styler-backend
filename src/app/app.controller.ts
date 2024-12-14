import { Controller, Get, Logger, Res } from '@nestjs/common';
import { AppService } from './app.service';

import { Public } from '@src/utils/decorators/public.decorator';
import { Response } from 'express';

@Controller()
@Public()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get('/heartbeat')
  getHeartbeat(): Object {
    return {
      status: 'OK',
      message: 'Service is up and running....',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/')
  root(@Res() res: Response): void {
    return this.appService.renderIndex(res);
  }

  // @Get('/pagination')
  // getAllOutlet() {
  //   const pagerDto = {
  //     pageNumber: 1,
  //     pageSize: 5,
  //   };
  //   const data = [];
  //   return {
  //     status: HttpStatus.ACCEPTED,
  //     data,
  //     pagination: pagerDto,
  //   };
  // }

  // @Get('/error')
  // getError() {
  //   throw new BadRequestException('invalid email');
  // }
}
