import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateClientDto } from "../dtos/client.dto";
import { ClientRepository } from "../repository/client.repository";
import { BcryptEncryptionService } from "@modules/encryption/services/bcrypt-encryption.service";
import { SellerLoginDto } from "@modules/atuhentication/dtos/seller-login.dto";
import { ClientEntity } from "../entities/client.entity";

@Injectable()
export class ClientService {
  constructor(
    private clientRepository: ClientRepository, 
    private bcryptEncryptionService: BcryptEncryptionService){}
  findAll() {
    // Logic for finding all records
    return [];
  }

  private async getEncryptedPassword(createClientDto: CreateClientDto): Promise<string> {
    const { password } = createClientDto
    return await this.bcryptEncryptionService.encrypt(password)
  }

  private async checkSellerUniqueness(createClientDto: CreateClientDto): Promise<void> {
    const seller = await this.clientRepository.getRepository().findOne({ where: { email: createClientDto.email}})
    if(seller){
      throw new BadRequestException(`Seller exists with provided email, please try with unique email`)
    }
  }

  async createSeller(createClientDto: CreateClientDto) {
    
    await this.checkSellerUniqueness(createClientDto)

   const encryptedPassword = await this.getEncryptedPassword(createClientDto)
   createClientDto.password = encryptedPassword

   
    
    const client = await this.clientRepository.getRepository().save(createClientDto)

   client.password = 'XXXXXX'

    return client 
    
  }

  async getSellerByEmail(sellerLoginDto: SellerLoginDto): Promise<ClientEntity>{
    const { username } = sellerLoginDto
    
    
    const seller = await this.clientRepository.getRepository().findOne({ where: { email: username}})
    if(!seller){
      throw new UnauthorizedException('Invalid credentials')
    }
  
    return seller
  }

  private async getClientByIdOrThrow(clientId: number ): Promise<ClientEntity> {
    const client = await this.clientRepository.getRepository().findOne({ where: { id: clientId } });
        
        if (!client) {
            throw new NotFoundException(`Outlet with ID ${clientId} not found`);
        }
        return client; 
  }

  async getClientById(clientId: number): Promise<ClientEntity> {
    return this.getClientByIdOrThrow(clientId)
  }

}