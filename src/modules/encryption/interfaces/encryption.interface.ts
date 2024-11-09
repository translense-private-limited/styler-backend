export interface EncryptionInterface {
  encrypt(password: string): Promise<string>;
  validate(
    encryptedPassword: string,
    passwordToCompareWith: string,
  ): Promise<boolean>;
}
