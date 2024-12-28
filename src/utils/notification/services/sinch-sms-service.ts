import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SinchSmsService {
  private readonly SERVICE_PLAN_ID = '1aae746964024adc84f5e4bc075308ba'; // Your servicePlanId
  private readonly API_TOKEN = 'a5cd425860454595936bb8e707782f52'; // Your API token
  private readonly SINCH_NUMBER = '+447418631942'; // Your Sinch virtual number
  private readonly REGION = 'sms'; // Sinch region
  private readonly SINCH_URL = `https://${this.REGION}.api.sinch.com/xms/v1/${this.SERVICE_PLAN_ID}/batches`;

  private readonly headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.API_TOKEN}`,
  };

  async sendSms(to: string, message: string): Promise<void> {
    const payload = {
      from: this.SINCH_NUMBER,
      to: [`+91${to}`], // Ensure it's an array of recipient numbers
      body: message,
    };

    try {
      const response = await axios.post(this.SINCH_URL, payload, {
        headers: this.headers,
      });
      console.log('Message sent successfully!', response.data);
    } catch (error) {
      console.error(
        'There was an error sending the SMS!',
        error.response?.data || error.message,
      );
    }
  }
}
