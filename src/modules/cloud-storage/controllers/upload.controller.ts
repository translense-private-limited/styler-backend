// import { Controller, Get } from '@nestjs/common';

import { Body, Controller, Put } from "@nestjs/common";
import { UploadUrlResponseInterface } from "@src/utils/interfaces/upload-r-url-response.interface";
import { KeyGeneratorService } from "../services/key-generator.service";
import { KeyGeneratorDto } from "../dtos/key-generator.dto";
import { AwsS3Service } from "@src/utils/aws/aws-s3.service";

// import { ApiTags } from '@nestjs/swagger';
// import { GcpService } from '@modules/libs/gcp/services/gcp.service';
// import { KeyGeneratorService } from '../services/key-generator.service';

// @Controller('upload/gcp')
// @ApiTags('Upload')
// export class UploadController {
//   constructor(
//     private keyGeneratorService: KeyGeneratorService,
//     private gcpService: GcpService,
//   ) {}

//   @Get()
//   getV4SignedUrl() {
//     const key = this.keyGeneratorService.getClientProfileKey(123, 2);
//     this.gcpService.configureBucketCors();
//     const url = this.gcpService.getSignedUrl(key);
//     return url;
//   }

//   @Get('plicy')
//   getV4SignedPolicy() {
//     const key = this.keyGeneratorService.getClientProfileKey(123, 2);
//     this.gcpService.configureBucketCors();
//     const url = this.gcpService.generateV4SignedPolicy(key);
//     return url;
//   }
// }
@Controller('s3')
export class UploadController{
    constructor(
        private readonly keyGeneratorService:KeyGeneratorService,
        private readonly awsS3Service: AwsS3Service
    ){}
    @Put('generate-url')
    async generateUploadUrl(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<UploadUrlResponseInterface> {
      const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
      const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key, keyGeneratorDto.mediaType);
    //   await this.fileMetadataRepository.getRepository().save({
    //     outletId,
    //     key: key,
    //     fileType,
    //   });
    //   await this.clientExternalService.saveProfilePhoto(clientId,key)
      return {
        signedUrl,
        key,
      };
    }
}