import { Module } from '@nestjs/common';

import { BcryptEncryptionService } from './services/bcrypt-encryption.service';

@Module({
  imports: [],
  providers: [BcryptEncryptionService],

  exports: [BcryptEncryptionService],
})
export class EncryptionModule {}
