import { Injectable } from '@nestjs/common';
import { EnvService } from '../modules/configs/env/services/env.service';
import { AppConfigInterface } from '../modules/configs/env/app.config';
import { EnvNamespaceEnum } from '../modules/configs/env/enums/env-namespace.enum';
import path from 'path';
import { Response } from 'express'; // Import Response from express

@Injectable()
export class AppService {
  constructor(private envService: EnvService) {}
  async getHello(): Promise<string> {
    const appConfig = this.envService.getEnvValue<AppConfigInterface>(
      EnvNamespaceEnum.APP_CONFIG,
    );
    return `Translense Server up and running at port ${appConfig.port}`;
  }

  renderIndex(res: Response): void {
    // Resolve the path for index.html from the current directory
    const indexPath = path.join(process.cwd(), '..', 'public', 'index.html');
    return res.sendFile(indexPath);
  }
}
