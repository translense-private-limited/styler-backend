import { Injectable } from '@nestjs/common';
import { OtpService } from './otp.service';

@Injectable()
export class OtpExternalService {
  constructor(private readonly otpService: OtpService) {}

  async deleteByRecipient(recipient: string): Promise<void> {
    return await this.otpService.deleteByRecipient(recipient);
  }
}
