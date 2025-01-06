import { Module } from '@nestjs/common';

import { UploadFilesController } from './controllers/upload.controller';
// import { LibsModule } from '@modules/libs/libs.module';
import { KeyGeneratorService } from './services/key-generator.service';
import { ClientModule } from '@modules/client/client/client.module';
import { OutletModule } from '@modules/client/outlet/outlet.module';
import { ServiceModule } from '@modules/client/services/service.module';

@Module({
  imports: [ClientModule,OutletModule,ServiceModule],
  providers: [KeyGeneratorService],
  controllers: [UploadFilesController],
})
export class CloudStorageModule {}
