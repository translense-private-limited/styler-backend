import { Module } from '@nestjs/common';

import { ClientUploadFilesController } from './controllers/client-upload.controller';
// import { LibsModule } from '@modules/libs/libs.module';
import { KeyGeneratorService } from './services/key-generator.service';
import { ClientModule } from '@modules/client/client/client.module';
import { OutletModule } from '@modules/client/outlet/outlet.module';
import { ServiceModule } from '@modules/client/services/service.module';
import { UploadFilesService } from './services/upload-files.service';
import { AdminUploadFilesController } from './controllers/admin-upload-controller';

@Module({
  imports: [ClientModule,OutletModule,ServiceModule],
  providers: [KeyGeneratorService,UploadFilesService],
  controllers: [ClientUploadFilesController,AdminUploadFilesController],
})
export class CloudStorageModule {}
