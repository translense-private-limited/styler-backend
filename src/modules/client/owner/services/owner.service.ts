import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateOwnerDto } from "../dtos/owner.dto";
import { OwnerRepository } from "../repository/owner.repository";
import { BcryptEncryptionService } from "@modules/encryption/services/bcrypt-encryption.service";
import { SellerLoginDto } from "@modules/atuhentication/dtos/seller-login.dto";
import { OwnerEntity } from "../entities/owner.entity";

@Injectable()
export class OwnerService {
  constructor(
    private ownerRepository: OwnerRepository, 
    private bcryptEncryptionService: BcryptEncryptionService){}
  findAll() {
    // Logic for finding all records
    return [];
  }

  private async getEncryptedPassword(createOwnerDto: CreateOwnerDto): Promise<string> {
    const { password } = createOwnerDto
    return await this.bcryptEncryptionService.encrypt(password)
  }

  private async checkSellerUniqueness(createOwnerDto: CreateOwnerDto): Promise<void> {
    const seller = await this.ownerRepository.getRepository().findOne({ where: { email: createOwnerDto.email}})
    if(seller){
      throw new BadRequestException(`Seller exists with provided email, please try with unique email`)
    }
  }

  async createSeller(createOwnerDto: CreateOwnerDto) {
    
    await this.checkSellerUniqueness(createOwnerDto)

   const encryptedPassword = await this.getEncryptedPassword(createOwnerDto)
   createOwnerDto.password = encryptedPassword

   
    
    const owner = await this.ownerRepository.getRepository().save(createOwnerDto)

   owner.password = 'XXXXXX'

    return owner 
    
  }

  async getSellerByEmail(sellerLoginDto: SellerLoginDto): Promise<OwnerEntity>{
    const { username } = sellerLoginDto
    
    
    const seller = await this.ownerRepository.getRepository().findOne({ where: { email: username}})
    if(!seller){
      throw new UnauthorizedException('Invalid credentials')
    }
  
    return seller
  }

}