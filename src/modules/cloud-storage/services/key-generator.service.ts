import { Injectable } from '@nestjs/common';

@Injectable()
export class KeyGeneratorService {
  getAdharKey(businessId: number, userId: number): string {
    return `${businessId}/personal/${userId}/adhar`;
  }
  getPanKey(businessId: number, userId: number): string {
    return `${businessId}/personal/${userId}/pan`;
  }

  getClientProfileKey(businessId: number, userId: number): string {
    return `${businessId}/personal/${userId}/profile-pic`;
  }

  getMenuImageKey(businessId: number, itemId: number): string {
    return `${businessId}/services/menus/${itemId}`;
  }

  getRoomImageKey(businessId: number, roomId: number): string {
    return `${businessId}/services/rooms/${roomId}`;
  }

  getFssaiKey(businessId: number): string {
    return `${businessId}/legals/fssai}`;
  }

  getGstKey(businessId: number): string {
    return `${businessId}/legals/gst}`;
  }

  getMouKey(businessId: number): string {
    return `${businessId}/legals/mou}`;
  }
}
