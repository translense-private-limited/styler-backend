import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/auth-service.interface';
import { SellerLoginDto } from '../dtos/seller-login.dto';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';
import { JwtService } from './jwt.service';
import { CreateClientDto } from '@modules/client/client/dtos/client.dto';

@Injectable()
export class SellerAuthService implements AuthServiceInterface {
    constructor(
      private bcryptEncryptionService: BcryptEncryptionService,
         private clientExternalService: ClientExternalService,
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

        const seller = await this.clientExternalService.getSellers(sellerLoginDto)

        const isCredentialValid = await this.bcryptEncryptionService.validate(password, seller.password)

        if(!isCredentialValid){
          throw new UnauthorizedException('Invalid Credential')
        }

        const jwtToken = await this.jwtService.generateToken(seller)

        return { seller, jwtToken}

        

  }

  async prepareClientTokenPayload (client : CreateClientDto ): Promise<any> {
    // ClientId 
    // whitelabelId
    // outletId
  }
}
