import { Injectable } from '@nestjs/common';
import { AuthServiceInterface } from './auth-service.interface';

@Injectable()
export class AdminAuthService implements AuthServiceInterface {
  async validateUser(email: string, password: string): Promise<any> {
    // Admin-specific logic for validation
  }

  generateToken(user: any): string {
    // Generate token for admin
    return 'admin-token';
  }
}
