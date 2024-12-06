import { NotFoundException } from '@nestjs/common'; // Import NotFoundException from NestJS

export function throwIfNotFound(entity: any, message: string): void {
    if (!entity) {
        throw new NotFoundException(message);
    }
}
