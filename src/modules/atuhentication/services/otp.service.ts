import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpRepository } from '../repositories/otp.repository';
import { SendOtpResponseInterface } from '../interfaces/send-otp-response.interface';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { CustomerExternalService } from '@modules/customer/services/customer-external.service';
import { CustomerEntity } from '@modules/customer/entities/customer.entity';

@Injectable()
export class OtpService {
  constructor(
    private otpRepository: OtpRepository,
    private customerExternalService: CustomerExternalService,
  ) {}

  private async generateOtp(): Promise<number> {
    return 123456;
  }

  async sendOtpToRecipient(recipient: string, otp: number) {
    //
    console.log(recipient, otp);
  }

  private async getCustomerByUsername(
    username: string,
  ): Promise<CustomerEntity> {
    const customer =
      await this.customerExternalService.getCustomerByUsername(username);
    if (!customer) {
      throw new NotFoundException(
        `No account found with the provided credentials`,
      );
    }
    return customer;
  }

  async sendOtp(
    recipient: string,
    expirationDurationInSeconds: number = 30,
  ): Promise<SendOtpResponseInterface> {
    // Check if customer exist with provided recipient

    await this.getCustomerByUsername(recipient);

    const otp = await this.generateOtp(); // Generates a random OTP code

    // Check if an existing OTP record exists for the recipient
    const existingOtp = await this.otpRepository.getRepository().findOne({
      where: {
        recipient,
      },
    });

    const expirationTime = new Date(
      Date.now() + expirationDurationInSeconds * 1000,
    );

    if (existingOtp) {
      // Update the existing record with a new OTP and expiration time
      existingOtp.otp = otp;
      existingOtp.expirationTime = expirationTime;

      existingOtp.resendAttempts += 1;

      await this.otpRepository.getRepository().save(existingOtp); // Save the updated OTP record
    } else {
      // Create a new OTP record if none exists for the recipient
      const newOtpRecord = this.otpRepository.getRepository().create({
        recipient: recipient,
        otp,
        expirationTime,
        resendAttempts: 0,
      });

      await this.otpRepository.getRepository().save(newOtpRecord); // Save the new OTP record
    }

    // Send the OTP (use an external email/SMS service)
    await this.sendOtpToRecipient(recipient, otp);

    return {
      message: 'OTP sent successfully',
      recipient,
      expiresIn: expirationDurationInSeconds,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { recipient, password, otp } = resetPasswordDto;

    // Fetch the OTP record for the given recipient and OTP
    const otpRecord = await this.otpRepository.getRepository().findOne({
      where: { recipient, otp },
    });

    // Check if the OTP record exists
    if (!otpRecord) {
      throw new UnauthorizedException('Invalid OTP or recipient.');
    }

    // Check if the OTP has expired
    if (otpRecord.expirationTime < new Date()) {
      throw new UnauthorizedException(
        'OTP expired. Please generate a new OTP.',
      );
    }

    // Update the customer's password
    await this.customerExternalService.updatePassword(recipient, password);

    // Delete the OTP record to prevent reuse
    await this.otpRepository.getRepository().delete({ recipient });
  }
}
