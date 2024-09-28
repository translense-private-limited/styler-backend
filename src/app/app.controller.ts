import { Controller, Get, Logger, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { SuccessResponse } from '../utils/response/interfaces/success-response.interface';
import { ResponseHandler } from '../utils/response/response-handler';

import { Public } from '@src/utils/decorators/public.decorator';



@Controller()
@Public()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
  
  ) {}

  @Get('/heartbeat')
  getHeartbeat() {
    return {
      status: 'OK',
      message: 'Service is up and running',
      timestamp: new Date().toISOString()
    };
  }
  @Get('/')
 
  getHello(): SuccessResponse<string> {
    this.appService.getHello();
 
    return ResponseHandler.success<string>('data');
  }

 
}
