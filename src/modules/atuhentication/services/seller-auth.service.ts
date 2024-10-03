import { Injectable } from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/auth-service.interface';
import { SellerLoginDto } from '../dtos/seller-login.dto';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { SellerExternalService } from '@modules/client/owner/services/seller-external.service';
import { JwtService } from './jwt.service';

@Injectable()
export class SellerAuthService implements AuthServiceInterface {
    constructor(private bcryptEncryptionService: BcryptEncryptionService,
         private sellerExternalService: SellerExternalService,
         private jwtService: JwtService
    ){}
  async validateUser(email: string, password: string): Promise<any> {
    // Seller-specific logic for validation
  }

  generateToken(user: any): string {
    // Generate token for seller
    return 'seller-token';
  }

  async login(sellerLoginDto: SellerLoginDto):Promise<any>   {
        const {  username, password } = sellerLoginDto

        const encryptedPassword = this.bcryptEncryptionService.encrypt(password)

        const seller = this.sellerExternalService.getSellers(sellerLoginDto)

        const jwtToken = await this.jwtService.generateToken(seller)

        return { seller, jwtToken}

        

  }
}
