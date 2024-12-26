import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PushNotificationBuilderDto } from '../dtos/push-notification-builder.dto';
import { DeviceTokenRepository } from '../repositories/device-token.repository';
import { RegisterDeviceTokenDto } from '../dtos/register-device-token.dto';
import { DeviceTokenEntity } from '../entities/device-token.entity';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly deviceTokenRepository:DeviceTokenRepository,
  ) {
    // Initialize Firebase Admin SDK
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }

  async registerDeviceToken(registerDeviceTokenDto: RegisterDeviceTokenDto): Promise<void> {
    const notification = new DeviceTokenEntity();
    notification.deviceToken = registerDeviceTokenDto.deviceToken;
    notification.platform = registerDeviceTokenDto.platform;
    notification.userId = registerDeviceTokenDto.userId;
    notification.userType = registerDeviceTokenDto.userType;
    notification.isActive = registerDeviceTokenDto.isActive;

    // Save notification to the database
    await this.deviceTokenRepository.getRepository().save(notification);
  }

  async sendNotification(pushNotificationBuilderDto: PushNotificationBuilderDto): Promise<void> {
    try {
      const message = {
        notification: {
          title: pushNotificationBuilderDto.title,
          body: pushNotificationBuilderDto.body,
        },
        tokens: pushNotificationBuilderDto.deviceTokens,
        data: pushNotificationBuilderDto.data,
      };

      // Send the notification
      await admin.messaging().sendEachForMulticast(message);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Error sending notification');
    }
  }
}
