import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

/**
 * Generates a hashed password using bcrypt.
 * @param password - The password to be hashed.
 * @returns A promise that resolves to the hashed password.
 * @throws Throws an error if hashing fails.
 */ export async function generateHashedPassword(
  password: string,
): Promise<string> {
  try {
    const saltRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

/**
 * Verifies an input password against a hashed password.
 * @param inputPassword - The input password to be verified.
 * @param hashedPassword - The hashed password to be compared against.
 * @returns A promise that resolves to true if the passwords match, otherwise false.
 * @throws Throws an error if verification fails.
 */
export async function verifyPassword(
  inputPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    const match: boolean = await bcrypt.compare(inputPassword, hashedPassword);
    if (!match) {
      throw new BadRequestException(
        'Password mismatch, please try with correct password',
      );
    }
    return match;
  } catch (error) {
    throw error;
  }
}
