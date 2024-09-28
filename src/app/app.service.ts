import { Injectable } from '@nestjs/common';
import { EnvService } from '../modules/configs/env/services/env.service';
import { AppConfig } from '../modules/configs/env/app.config';
import { EnvNamespace } from '../modules/configs/env/enums/env-namespace.enum';

@Injectable()
export class AppService {
  constructor(private envService: EnvService) {}
  async getHello(): Promise<string> {
    const appConfig = this.envService.getEnvValue<AppConfig>(
      EnvNamespace.APP_CONFIG,
    );
    return `Translense Server up and running at port ${appConfig.port}`;
  }
}
