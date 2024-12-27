import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PushNotificationBuilderDto } from '../dtos/push-notification-builder.dto';
import { DeviceTokenRepository } from '../repositories/device-token.repository';
import { DeviceTokenDto } from '../dtos/device-token.dto';
import { DeviceTokenEntity } from '../entities/device-token.entity';
// import serviceAccount from '/home/prasanthi/Downloads/service-account-key.json';
// import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly deviceTokenRepository:DeviceTokenRepository,
  ) {
    // Initialize Firebase Admin SDK

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: "fir-push-notification-e6947",
          privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCTL9DeP79Mdh3J\nrGsG/nAGbqiVdiAp3Qb6arqYvEFqoY58oLcGR7Jhj7WXuZAhbpPUnfOYa7DSm3Qy\n5tQg/l1EOoSY7gFCIpmVCoqlySHhBPL+IoEibEQap43qhPLewmJALLqI1LSYNpNI\njMU2V4DcrrIoo898l+tLYEix1WQUyrWRGloI0Y212TmrHGSwcbYHbe5qjLKD/xp4\nQL7aMYLY/sgaw4G+vtV73TvbNor1iwrMTQHh3u8GsxnZ2TMMxCttQgq8YHXsRo7t\nI0WQOSypAxqLSEP2Phu5Xtz50StFiVydAd7FMmOfBIcau3BfwQYvcfsfVkUdaZcj\nXopNW1ZFAgMBAAECggEAEkBj62dmwqXD+Fnt1Kpw/E81DwGcp+xNXPimpmFz0DPz\n7g7k2z3BSDlQmJ2tWoPyh3NFvXEfNmKKBHTcubGpIZiLEEa1N70AI/vwaPH5xkQ9\nmJdxQXJA+Lgt0DbHwilDEzeosuaDdXuRBHZWTzCHHXZ5R7JWfJn/FrP8F7dBJ5Wy\nQ4e3azz/Kx1wuR0mVsnJGHnZjKIl+w5Zbd9fKtI18N+tA7nRvnQFPUbxfhlN/7QS\nPwlvpTOWX0ItHll17lPo8XSJhFAPBzt1nIhbcfSMVL4WW++JH4lyli5j4PKAsV3o\nK6142/ErmAidOhCdXR3ICnbLDqSQ+tW0ZpciA+p7yQKBgQDKCNLqywq5Yxjs5I7I\ni5a27Q52SPS3IWqn6RTAxEf0OAc10XuFkiIESuB2rfbr2YXAHpBY4VpvSy+j1TbL\n+eNHmdQZ5Yd/BbCXY/YkbPZkJ4QLD6BNKkvuWIC5TFt0UCxM/+XR/C19tVT2ptOm\nJSjM3F/MD03loKOgxRNtiZ0vqQKBgQC6gH22UxTyWxhxzZ8KD3ppFmPIuhFN2xuS\nM+uETAjkbT0pE4m6eHVbL/1GC67NB5cSVfxFQAQdXCijz84L0oDl7MnOYcmq+3Se\nykgiYUtTot3Bwv5ETWeVyr42GFCMDOpJSAVoUlqyk1/n8N3cjh1djPmUudejIX5c\nfCe7x5gDPQKBgGox2SuxLiHkBOX//U1Mkhv03vUtw/O+jOFVkqMAiRHFoYSYZ+T9\nuwOml/XJ21B9NeCWMCmHypFVY+Up3XO6Fc08/k/eZipOQ1RQJsFexORAIRfvTsNA\nyEiwHHlJuYiZ269dkt+dPgwllFNRvU5HmfqUm4YXRUq99UQ8Usnw276BAoGAPcFw\nXyAxrnK1rHFe+VDYwtV0IzJhqnskLQxeL0eSJjl56BEdKQ7cJV7Fqh0SO7gIsTyh\ntTiWZDZxCpUz8Dw7DGeVB27f/WsYWcA3lJLNA5vJfHCaC3nqE/K3e2gfu9BHAA8G\nI14pxDoCpuXeQTsZxDF7L2E+YzkjA3LlIUvdLS0CgYEAmF8umDssVizA1xarXZ/8\nN2j8shN45Ln0YrVAJea9O0sEt6jJrhePXrEKo4mvmhN5Rzb7IIAi1WzIG3ikb1WW\nFgmjBu95z6rE5qod0S2J5fPmqUAf+mVwsGIaPeEbsXy39x+cyhqx3g1skvS6rYZG\nS4Vs8Yx2KbHfkhRIPWRXtMY=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'), // Ensure correct key format
          clientEmail: "firebase-adminsdk-m4fkv@fir-push-notification-e6947.iam.gserviceaccount.com"
        }),
      });
      console.log('Firebase Admin SDK initialized successfully.');
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

  async sendNotification(pushNotificationBuilderDto: PushNotificationBuilderDto): Promise<string> {
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
      return 'notification was sent successfully';
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Error sending notification');
    }
  }
}
