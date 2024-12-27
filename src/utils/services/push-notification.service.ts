import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PushNotificationBuilderDto } from '../dtos/push-notification-builder.dto';
import { DeviceTokenRepository } from '../repositories/device-token.repository';
import { DeviceTokenDto } from '../dtos/device-token.dto';
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

  async registerDeviceToken(deviceTokenDto: DeviceTokenDto): Promise<void> {
    const notification = new DeviceTokenEntity();
    notification.deviceToken = deviceTokenDto.deviceToken;
    notification.platform = deviceTokenDto.platform;
    notification.userId = deviceTokenDto.userId;
    notification.userType = deviceTokenDto.userType;
    notification.isActive = deviceTokenDto.isActive;

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
