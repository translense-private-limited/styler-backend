import { Controller, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { GcpService } from '@modules/libs/gcp/services/gcp.service';
import { KeyGeneratorService } from '../services/key-generator.service';

@Controller('upload/gcp')
@ApiTags('Upload')
export class UploadController {
  constructor(
    private keyGeneratorService: KeyGeneratorService,
    private gcpService: GcpService,
  ) {}

  @Get()
  getV4SignedUrl() {
    const key = this.keyGeneratorService.getClientProfileKey(123, 2);
    this.gcpService.configureBucketCors();
    const url = this.gcpService.getSignedUrl(key);
    return url;
  }

  @Get('plicy')
  getV4SignedPolicy() {
    const key = this.keyGeneratorService.getClientProfileKey(123, 2);
    this.gcpService.configureBucketCors();
    const url = this.gcpService.generateV4SignedPolicy(key);
    return url;
  }
}
