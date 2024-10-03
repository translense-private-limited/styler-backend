import { Injectable } from "@nestjs/common";

@Injectable()
export class AtuhenticationService {
 constructor(private AtuhenticationRepository: atuhenticationRepository) {}
  
  findAll() {
    // Logic for finding all records
    return [];
  }

  create() {
    // Logic for creating a new record
    this.atuhenticationRepository.getRepository().save()
    return { message: "Created successfully" };
  }
}