import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvNamespace } from '../enums/env-namespace.enum';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  getEnvValue<T>(namespaceKey: EnvNamespace): T {
    return this.configService.getOrThrow(namespaceKey);
  }
}
