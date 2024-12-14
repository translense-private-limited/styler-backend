import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const isPublicKey = 'isPublic';

export const Public = (): CustomDecorator<string> =>
  SetMetadata(isPublicKey, true);
