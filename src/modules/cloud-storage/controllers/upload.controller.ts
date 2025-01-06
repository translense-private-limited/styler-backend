import { Body, Controller, Put } from "@nestjs/common";
import { KeyGeneratorDto } from "../dtos/key-generator.dto";
import { UploadFilesService } from "../services/upload-files.service";

@Controller('s3')
export class UploadFilesController{
    constructor(
      private readonly uploadFilesService:UploadFilesService
    ){}
    @Put('client/profile-photo/generate-upload-url')
    async generateUploadUrlForClientProfilePhoto(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForClientProfilePhotoUpload(keyGeneratorDto);
    }

    @Put('client/pan/generate-upload-url')
    async generateUploadUrlForClientPan(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForClientPanUpload(keyGeneratorDto);
    }

    @Put('client/aadhar/generate-upload-url')
    async generateUploadUrlForClientAadhar(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForClientAadharUpload(keyGeneratorDto);
    }

    @Put('service/service-image/generate-upload-url')
    async generateUploadUrlForServiceImage(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForServiceImageUpload(keyGeneratorDto);
    }

    @Put('service/service-video/generate-upload-url')
    async generateUploadUrlForServiceVideo(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForServiceVideoUpload(keyGeneratorDto);
    }

    @Put('outlet/outlet-banner-image/generate-upload-url')
    async generateUploadUrlForOutletBannerImage(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForOutletBannerImageUpload(keyGeneratorDto);
    }

    @Put('outlet/outlet-video/generate-upload-url')
    async generateUploadUrlForOutletVideo(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForOutletVideoUpload(keyGeneratorDto);
    }

    @Put('outlet/gst/generate-upload-url')
    async generateUploadUrlForOutletGst(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForOutletGstUpload(keyGeneratorDto);
    }

    @Put('outlet/registration/generate-upload-url')
    async generateUploadUrlForOutletRegistration(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForOutletRegistrationUpload(keyGeneratorDto);
    }

    @Put('outlet/mou/generate-upload-url')
    async generateUploadUrlForOutletMou(
      @Body() keyGeneratorDto: KeyGeneratorDto,
    ): Promise<string> {
      return await this.uploadFilesService.getSignedUrlForOutletMouUpload(keyGeneratorDto);
    }
}  