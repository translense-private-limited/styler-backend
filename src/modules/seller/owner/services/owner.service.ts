import { Injectable } from "@nestjs/common";
import { CreateOwnerDto } from "../dtos/owner.dto";
import { OwnerRepository } from "../repository/owner.repository";

@Injectable()
export class OwnerService {
  constructor(private ownerRepository: OwnerRepository){}
  findAll() {
    // Logic for finding all records
    return [];
  }

  async create(createOwnerDto: CreateOwnerDto) {
    // Logic for creating a new record
    
    const owner = await this.ownerRepository.getRepository().save(createOwnerDto)

    return owner 
    
  }
}