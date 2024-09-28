import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { SuccessResponse } from '../utils/response/interfaces/success-response.interface';
import { ResponseHandler } from '../utils/response/response-handler';
import { EmailSender } from '@modules/notifications/email/email-sender';
import { RecipientDto } from '@modules/notifications/email/recipient.dto';
import { Public } from '@src/utils/decorators/public.decorator';
import { Roles } from '@src/utils/decorators/roles.decorator';
import { ResourceEnum } from '@src/utils/enums/resource-enum';
import { PermissionEnum } from '@modules/auth/enums/permission.enum';

@Controller()
@Public()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private emailSender: EmailSender,
  ) {}

  @Get('/')
  @Roles([{ [ResourceEnum.REPORT]: [PermissionEnum.DELETE] }])
  getHello(): SuccessResponse<string> {
    this.appService.getHello();
    this.sendMail();
    return ResponseHandler.success<string>('data');
  }

  sendMail() {
    const recipient = new RecipientDto();
    recipient.name = 'Atul';
    recipient.email = 'atul7v7@gmail.com';
    this.emailSender.sendEmail([recipient], 'Testing');
  }
}
