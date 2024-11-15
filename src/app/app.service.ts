import { Injectable } from '@nestjs/common';
import { EnvService } from '../modules/configs/env/services/env.service';
import { AppConfigInterface } from '../modules/configs/env/app.config';
import { EnvNamespaceEnum } from '../modules/configs/env/enums/env-namespace.enum';

@Injectable()
export class AppService {
  constructor(private envService: EnvService) { }
  async getHello(): Promise<string> {
    const appConfig = this.envService.getEnvValue<AppConfigInterface>(
      EnvNamespaceEnum.APP_CONFIG,
    );
    return `Translense Server up and running at port ${appConfig.port}`;
  }
}
