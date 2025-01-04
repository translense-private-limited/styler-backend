import { Controller } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
// import { UploadUrlResponseInterface } from '../interfaces/upload-r-url-response.interface';
 import { FileMetaDataRepository } from '../repositories/file-metadata.Repository';
// import { FileUploadInfoDto } from '../dtos/file-upload-info.dto';
// import { ClientIdDecorator } from '../decorators/client-id.decorator';
//import { ClientIdDto } from '../dtos/client-id.dto';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('s3')
@ApiTags('aws/upload')
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service,
    private readonly fileMetadataRepository:FileMetaDataRepository,
    private readonly clientExternalService:ClientExternalService
  ) {}

  // @Put('profile-photo/generate-url')
  // async generateProfilePhotoUploadUrl(
  //   @Body() fileUploadInfoDto: FileUploadInfoDto,
  //   @ClientIdDecorator() clientIdDto: ClientIdDto,
  // ): Promise<UploadUrlResponseInterface> {
  //   const {clientId }= clientIdDto;
  //   const { outletId, fileName, fileType } = fileUploadInfoDto;
  //   const key = `${outletId}/profilePhoto/${fileName}`;
  //   const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key, fileType);
  //   await this.fileMetadataRepository.getRepository().save({
  //     outletId,
  //     key: key,
  //     fileType,
  //   });
  //   await this.clientExternalService.saveProfilePhoto(clientId,key)
  //   return {
  //     signedUrl,
  //     key,
  //   };
  // }

  // @Put('outlet-banner-image/generate-url')
  // async generateOutletBannerImageUploadUrl(
  //   @Body() fileUploadInfoDto: FileUploadInfoDto,
  // ): Promise<UploadUrlResponseInterface> {
  //   const { outletId, fileName, fileType } = fileUploadInfoDto;
  //   const key = `${outletId}/outletBanner/${fileName}`; // Construct the file key
  //   const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key, fileType);
  //   await this.fileMetadataRepository.getRepository().save({
  //     outletId,
  //     keyName: key,
  //     fileType,
  //   });
  //   return {
  //     signedUrl,
  //     key,
  //   };
  // }

  // @Put('service-image/generate-url')
  // async generateServiceImageUploadUrl(
  //   @Body() fileUploadInfoDto: FileUploadInfoDto,
  // ): Promise<UploadUrlResponseInterface> {
  //   const { outletId, fileName, fileType } = fileUploadInfoDto;
  //   const key = `${outletId}/serviceImages/${fileName}`; // Construct the file key
  //   const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key, fileType);
  //   await this.fileMetadataRepository.getRepository().save({
  //     outletId,
  //     keyName: key,
  //     fileType,
  //   });

  //   return {
  //     signedUrl,
  //     key,
  //   };
  // }

  // @Put('generate-url')
  // async generateVideoUploadUrl(
  //   @Body() fileUploadInfoDto: FileUploadInfoDto
  // ): Promise<UploadUrlResponseInterface> {
  //   const { outletId, fileName, fileType } = fileUploadInfoDto;
  //   const key = `${outletId}/videos/${fileName}`;
  //   const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key, fileType);
  //   await this.fileMetadataRepository.getRepository().save({
  //     outletId,
  //     keyName: key,
  //     fileType,
  //   });
  //   return {
  //     signedUrl,
  //     key,
  //   };
  // }

  // @Put('document/generate-url')
  // async generateDocumentUploadUrl(
  //   @Body() fileUploadInfoDto:FileUploadInfoDto
  // ): Promise<UploadUrlResponseInterface> {
  //   const { outletId, fileName, fileType } = fileUploadInfoDto;
  //   const key = `${outletId}/documents/${fileName}`;
  //   const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key, fileType);
  //   await this.fileMetadataRepository.getRepository().save({
  //     outletId,
  //     keyName: key,
  //     fileType,
  //   });
  //   return {
  //     signedUrl,
  //     key,
  //   };
  // }

}
