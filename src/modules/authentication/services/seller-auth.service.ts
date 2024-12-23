import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/auth-service.interface';
import { SellerLoginDto } from '../dtos/seller-login.dto';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';
import { JwtService } from './jwt.service';
//import { CreateClientDto } from '@modules/client/client/dtos/client.dto';
import { ClientEntity } from '@modules/client/client/entities/client.entity';
import { ClientOutletMappingExternalService } from '@modules/admin/client-outlet-mapping/services/client-outlet-mapping-external.service';

@Injectable()
export class SellerAuthService implements AuthServiceInterface {
  constructor(
    private bcryptEncryptionService: BcryptEncryptionService,
    private clientExternalService: ClientExternalService,
    private readonly clientOutletMappingExternalService:ClientOutletMappingExternalService,
    private jwtService: JwtService,
  ) {}

  async addHeaderDataForTokenPayload(client: ClientEntity): Promise<ClientEntity> {
    // delete password from object
    delete client.password;

    const outletIds = await this.clientOutletMappingExternalService.getClientLinkedOutletIds(client.id);
    // now add the
    const headers = {
      whitelabelId: 1,
      clientId: client.id,
      outletIds: outletIds,
    };

    client['headers'] = headers;

    return client;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async login(sellerLoginDto: SellerLoginDto): Promise<any> {
    const { password } = sellerLoginDto;

    const seller = await this.clientExternalService.getSellers(sellerLoginDto);

    const isCredentialValid = await this.bcryptEncryptionService.validate(
      password,
      seller.password,
    );

    if (!isCredentialValid) {
      throw new UnauthorizedException('Invalid Credential');
    }
    const tokenPayload = await this.addHeaderDataForTokenPayload(seller);
    const jwtToken = await this.jwtService.generateToken(tokenPayload);
    return { seller, jwtToken };
  }
}
