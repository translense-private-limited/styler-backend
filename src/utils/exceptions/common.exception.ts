import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common'; // Import NotFoundException from NestJS

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throwIfNotFound(entity: any, message: string): void {
  if (!entity) {
    throw new NotFoundException(message);
  }
}

export function badRequest(message: string): void {
  throw new BadRequestException(message);
}

export function unauthorized(message: string): void {
  throw new UnauthorizedException(message);
}
