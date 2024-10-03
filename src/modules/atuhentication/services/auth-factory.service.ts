import { Injectable } from '@nestjs/common';
import { CustomerAuthService } from './customer-auth.service';
import { SellerAuthService } from './seller-auth.service';
import { AdminAuthService } from './admin-auth.service';
import { AuthServiceInterface } from './auth-service.interface';

@Injectable()
export class AuthServiceFactory {
  constructor(
    private customerAuthService: CustomerAuthService,
    private sellerAuthService: SellerAuthService,
    private adminAuthService: AdminAuthService,
  ) {}

  getAuthService(userType: string): AuthServiceInterface {
    switch (userType) {
      case 'customer':
        return this.customerAuthService;
      case 'seller':
        return this.sellerAuthService;
      case 'admin':
        return this.adminAuthService;
      default:
        throw new Error('Invalid user type');
    }
  }
}
