import { Injectable } from "@nestjs/common";

@Injectable()
export class EncryptionService {
 constructor(private EncryptionRepository: encryptionRepository) {}
  
  findAll() {
    // Logic for finding all records
    return [];
  }

  create() {
    // Logic for creating a new record
    this.encryptionRepository.getRepository().save()
    return { message: "Created successfully" };
  }
}