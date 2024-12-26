import { Injectable, BadRequestException } from '@nestjs/common';
import { LessThan } from 'typeorm';
import { OtpVerificationEntity } from '../entities/otp.entity';
import { OtpTypeEnum } from '../enums/otp-type.enum';
import { OtpVerificationRepository } from '../repositories/otp.repository';
import { Interval } from '@nestjs/schedule';


@Injectable()
export class OtpService {
  constructor(private readonly otpVerificationRepository: OtpVerificationRepository) {}

  private generateRandomOtp(): number {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  }

  async generateOtp(
    clientId: number,
    customerId: number,
    orderId: number,
    orderFulfillmentTime: Date,
    type: OtpTypeEnum,
  ): Promise<OtpVerificationEntity> {
    const otp = this.generateRandomOtp();

    // Calculate expiration time: 6 hours after order fulfillment time
    const expirationTime = new Date(orderFulfillmentTime);
    expirationTime.setHours(expirationTime.getHours() + 6);

    const otpEntity = this.otpVerificationRepository.getRepository().create({
      clientId,
      customerId,
      orderId,
      otp,
      type,
      expirationTime,
    });
    
    await this.otpVerificationRepository.getRepository().save(otpEntity);

    // Simulate sending OTP to the customer (e.g., SMS/Email)
    // console.log(`OTP ${otp} sent to customer ${customerId}.`);

    return otpEntity;
  }

  async validateOtp(otp: number, type: OtpTypeEnum): Promise<void> {
    const otpEntity = await this.otpVerificationRepository.getRepository().findOne({ where: { otp, type } });

    if (!otpEntity) {
      throw new BadRequestException('Invalid OTP');
    }

    const now = new Date();
    if (otpEntity.expirationTime < now) {
      throw new BadRequestException('OTP has expired');
    }

    // OTP is valid; proceed with further actions
    // console.log(`OTP validated successfully for type ${type}.`);
  }

  async cleanUpExpiredOtps(): Promise<void> {
    const now = new Date();
    await this.otpVerificationRepository.getRepository().delete({ expirationTime: LessThan(now) });
  }

  // Periodic cleanup using @Interval
  @Interval(1000 * 60 * 60 * 24) 
  async periodicOtpCleanup(): Promise<void> {
    await this.cleanUpExpiredOtps();
  }
}
