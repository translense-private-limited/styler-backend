import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { EncryptionInterface } from '../interfaces/encryption.interface';

@Injectable()
export class BcryptEncryptionService implements EncryptionInterface {
  private readonly saltRounds = 10;

  async encrypt(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  async validate(
    plainText: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainText, encryptedPassword);
  }
}
