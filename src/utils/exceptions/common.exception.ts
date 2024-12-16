import { NotFoundException } from '@nestjs/common'; // Import NotFoundException from NestJS

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throwIfNotFound(entity: any, message: string): void {
  if (!entity) {
    throw new NotFoundException(message);
  }
}
