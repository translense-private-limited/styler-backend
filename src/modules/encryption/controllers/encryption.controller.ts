import { Controller, Get, Post } from '@nestjs/common';
import { EncryptionService } from '../services/encryption.service';

@Controller('encryption')
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Get()
  findAll() {
    return this.encryptionService.findAll();
  }

  @Post()
  create() {
    return this.encryptionService.create();
  }
}
