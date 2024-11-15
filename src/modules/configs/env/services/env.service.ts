import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvNamespaceEnum } from '../enums/env-namespace.enum';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) { }

  getEnvValue<T>(namespaceKey: EnvNamespaceEnum): T {
    return this.configService.getOrThrow(namespaceKey);
  }
}
