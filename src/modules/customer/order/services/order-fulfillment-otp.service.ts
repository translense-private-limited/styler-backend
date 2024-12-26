import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderFulfillmentOtpEntity } from '../entities/otp.entity';
import { OtpTypeEnum } from '../enums/otp-type.enum';
import {  OrderFulfillmentOtpRepository} from '../repositories/otp.repository';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class OrderFulfillmentOtpService {
  constructor(private readonly orderFulfillmentOtpRepository: OrderFulfillmentOtpRepository) {}

  private generateRandomOtp(): number {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  }

  async generateOtp(
    clientId: number,
    customerId: number,
    orderId: number,
    orderFulfillmentTime: Date,
    type: OtpTypeEnum,
  ): Promise<OrderFulfillmentOtpEntity> {
    const otp = this.generateRandomOtp();

    // Calculate expiration time: 6 hours after order fulfillment time
    const expirationTime = new Date(orderFulfillmentTime);
    expirationTime.setHours(expirationTime.getHours() + 6);

    const otpEntity = this.orderFulfillmentOtpRepository.getRepository().create({
      clientId,
      customerId,
      orderId,
      otp,
      type,
      expirationTime,
    });
    
    await this.orderFulfillmentOtpRepository.getRepository().save(otpEntity);

    // Simulate sending OTP to the customer (e.g., SMS/Email)
    // console.log(`OTP ${otp} sent to customer ${customerId}.`);

    return otpEntity;
  }

  async validateOtp(otp: number, type: OtpTypeEnum): Promise<void> {
    const otpEntity = await this.orderFulfillmentOtpRepository.getRepository().findOne({ where: { otp, type } });

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


  private async cleanUpExpiredOtpsInBatches(batchSize: number): Promise<void> {
    const now = new Date();
    let deletedCount: number;

    do {
      // Fetch expired OTPs in batches
      const expiredOtps = await this.orderFulfillmentOtpRepository
        .getRepository()
        .createQueryBuilder('otp')
        .where('otp.expirationTime < :now', { now })
        .limit(batchSize)
        .getMany();

      deletedCount = expiredOtps.length;

      if (deletedCount > 0) {
        const ids = expiredOtps.map((otp) => otp.id);

        // Delete fetched OTPs using their IDs
        await this.orderFulfillmentOtpRepository
          .getRepository()
          .createQueryBuilder()
          .delete()
          .whereInIds(ids)
          .execute();
      }
    } while (deletedCount > 0);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledOtpCleanup(): Promise<void> {
    const batchSize = 100; // Adjust the batch size as needed
    await this.cleanUpExpiredOtpsInBatches(batchSize);
  }
}
