export class PushNotificationBuilderDto {
    deviceTokens: string[];
    title: string;
    body: string;
    data: Record<string, any>;
  
    constructor() {
      this.deviceTokens = [];
      this.title = '';
      this.body = '';
      this.data = {};
    }
  }
  