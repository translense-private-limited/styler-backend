import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret = 'your-secret-key'; // Store securely in environment variables

  // Method to generate JWT
  generateToken(payload: object, expiresIn: string = '24h'): string {
    // Convert to plain object if necessary
    const plainPayload = JSON.parse(JSON.stringify(payload));
    return jwt.sign(plainPayload, this.secret, { expiresIn });
  }

  // Method to verify JWT
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Method to extract the token from request headers
  extractTokenFromHeader(headers: any): string | null {
    const authHeader = headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1]; // Extract token
    }
    return null;
  }
}
