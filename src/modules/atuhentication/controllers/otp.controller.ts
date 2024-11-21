import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from '../services/otp.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SendOtpResponseInterface } from '../interfaces/send-otp-response.interface';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { Public } from '@src/utils/decorators/public.decorator';

@Controller('customer')
@ApiBearerAuth('jwt')
@Public()
export class OtpController {
  constructor(private otpService: OtpService) {}

  /**
   * Endpoint to send an OTP to the user.
   *
   * @param {Object} body - The request body containing the username.
   * @param {string} body.username - The username, which can be an email or a contact number.
   * @returns {Promise<SendOtpResponseDto>} - Response containing OTP details.
   */
  @Post('send-otp')
  async sendOtp(
    @Body() body: { username: string },
  ): Promise<SendOtpResponseInterface> {
    return await this.otpService.sendOtp(body.username);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    await this.otpService.resetPassword(resetPasswordDto);
    return 'Password updated successfully';
  }
}
