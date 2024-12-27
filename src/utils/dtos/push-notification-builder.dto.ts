export class PushNotificationBuilderDto {
    deviceTokens: string[];
    title: string;
    body: string;
  
    constructor() {
      this.deviceTokens = [];
      this.title = '';
      this.body = '';
    }
  }
  