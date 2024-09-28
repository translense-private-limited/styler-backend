import { Module } from '@nestjs/common';

import { UploadController } from './controllers/upload.controller';
import { LibsModule } from '@modules/libs/libs.module';
import { KeyGeneratorService } from './services/key-generator.service';

@Module({
  providers: [KeyGeneratorService],
  controllers: [UploadController],
  imports: [LibsModule],
})
export class CloudStorageModule {}
