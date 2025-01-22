import { Injectable } from "@nestjs/common";
import { KeyGeneratorService } from "./key-generator.service";
import { KeyGeneratorDto } from "../dtos/key-generator.dto";
import { AwsS3Service } from "@src/utils/aws/aws-s3.service";
import { ClientExternalService } from "@modules/client/client/services/client-external.service";
import { OutletExternalService } from "@modules/client/outlet/services/outlet-external.service";
import { MediaTypeEnum } from "../enums/media-type.enum";
import { ContentTypeEnum } from "../enums/content-type.enum";
import { v4 as uuidv4 } from 'uuid';
import { badRequest } from "@src/utils/exceptions/common.exception";
import { PresignedUrlResponseInterface } from "../interfaces/presigned-url-response.interface";

@Injectable()
export class UploadFilesService {
  constructor(
    private readonly keyGeneratorService: KeyGeneratorService,
    private readonly awsS3Service: AwsS3Service,
    private readonly clientExternalService: ClientExternalService,
    private readonly outletExternalService: OutletExternalService,
  ) {}

  async generatePreSignedUrlToUpload(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {
    const method = await this.mediaTypeMethodMapper(keyGeneratorDto.mediaType);
    return await method(keyGeneratorDto);
  }

  async getSignedUrl(key: string): Promise<string> {
    const url = await this.awsS3Service.generateSignedUrlForDownload(key);

    return url;
  }

  private async mediaTypeMethodMapper(
    mediaType: MediaTypeEnum,
  ): Promise<(keyGeneratorDto: KeyGeneratorDto) => Promise<PresignedUrlResponseInterface>> {
    const mediaTypeMethodMap: Map<
      MediaTypeEnum,
      (keyGeneratorDto: KeyGeneratorDto) => Promise<PresignedUrlResponseInterface>
    > = new Map([
      [MediaTypeEnum.PAN, this.getPresignedUrlToUploadPan.bind(this)],
      [MediaTypeEnum.AADHAR, this.getPresignedUrlToUploadAadhar.bind(this)],
      [
        MediaTypeEnum.PROFILE_PHOTO,
        this.getPresignedUrlToUploadProfilePhoto.bind(this),
      ],
      [
        MediaTypeEnum.SERVICE_IMAGE,
        this.getPresignedUrlToUploadServiceImage.bind(this),
      ],
      [
        MediaTypeEnum.SERVICE_SUBTYPE_IMAGE,
        this.getPresignedUrlToUploadServiceSubtypeImage.bind(this),
      ],
      [
        MediaTypeEnum.SERVICE_VIDEO,
        this.getPresignedUrlToUploadServiceVideo.bind(this),
      ],
      [
        MediaTypeEnum.OUTLET_BANNER,
        this.getPresignedUrlToUploadOutletBannerImage.bind(this),
      ],
      [
        MediaTypeEnum.OUTLET_VIDEO,
        this.getPresignedUrlToUploadOutletVideo.bind(this),
      ],
      [MediaTypeEnum.OUTLET_GST, this.getPresignedUrlToUploadGst.bind(this)],
      [
        MediaTypeEnum.OUTLET_REGISTRATION,
        this.getPresignedUrlToUploadRegistration.bind(this),
      ],
      [MediaTypeEnum.OUTLET_MOU, this.getPresignedUrlToUploadMou.bind(this)],
    ]);

    return mediaTypeMethodMap.get(mediaType);
  }

  async getPresignedUrlToUploadProfilePhoto(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {
    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }
    keyGeneratorDto.clientId  = keyGeneratorDto.clientId || Date.now();
    const maxFileSize = 1; // in MB
    const allowedTypes = [
      ContentTypeEnum.IMAGE_JPEG,
      ContentTypeEnum.IMAGE_PNG,
    ];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.IMAGE_JPEG,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   // await this.clientExternalService.updateProfilePhoto(keyGeneratorDto.clientId, key);
    // } catch (error) {
    //   throw new Error(
    //     `Failed to save the profile photo for client with given ClientId`,
    //   );
    // }
    return {key,signedUrl};
  }

  async getPresignedUrlToUploadPan(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }
    keyGeneratorDto.clientId  = keyGeneratorDto.clientId || Date.now();
    const maxFileSize = 3;
    const allowedTypes = [
      ContentTypeEnum.APPLICATION_PDF,
      ContentTypeEnum.APPLICATION_MSWORD,
    ];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.APPLICATION_PDF,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   await this.clientExternalService.saveClientPAN(
    //     keyGeneratorDto.clientId,
    //     key,
    //   );
    // } catch (error) {
    //   throw new Error(
    //     `Failed to save the PAN doc for client with the given ClientId`,
    //   );
    // }
    return {key,signedUrl};
  }

  async getPresignedUrlToUploadAadhar(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }
    keyGeneratorDto.clientId  = keyGeneratorDto.clientId || Date.now();
    const maxFileSize = 3;
    const allowedTypes = [
      ContentTypeEnum.APPLICATION_PDF,
      ContentTypeEnum.APPLICATION_MSWORD,
    ];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.APPLICATION_PDF,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   await this.clientExternalService.saveClientAadhaar(
    //     keyGeneratorDto.clientId,
    //     key,
    //   );
    // } catch (error) {
    //   throw new Error(
    //     `Failed to save the Aadhar doc for client with the given ClientId`,
    //   );
    // }
    return {key,signedUrl};
  }
  async getPresignedUrlToUploadServiceImage(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }
    keyGeneratorDto.serviceId  = keyGeneratorDto.serviceId || uuidv4();
    const maxFileSize = 1; // in MB
    const allowedTypes = [
      ContentTypeEnum.IMAGE_JPEG,
      ContentTypeEnum.IMAGE_PNG,
    ];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.IMAGE_JPEG,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   // await this.serviceExternalService.updateServiceByIdOrThrow(keyGeneratorDto.serviceId,updateServiceDto)
    // } catch (error) {
    //   throw new Error(`Failed to save service images with the given serviceId`);
    // }
    return {key,signedUrl};
  }

  async getPresignedUrlToUploadServiceSubtypeImage(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }
    keyGeneratorDto.serviceId  = keyGeneratorDto.serviceId || uuidv4();
    keyGeneratorDto.subtypeId = keyGeneratorDto.subtypeId || uuidv4();
    const maxFileSize = 1; // in MB
    const allowedTypes = [
      ContentTypeEnum.IMAGE_JPEG,
      ContentTypeEnum.IMAGE_PNG,
    ];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.IMAGE_JPEG,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   // await this.serviceExternalService.updateServiceByIdOrThrow(keyGeneratorDto.serviceId,updateServiceDto)
    // } catch (error) {
    //   throw new Error(`Failed to save service subtype images with the given serviceId and subtypeId`);
    // }
    return {key,signedUrl};
  }

  async getPresignedUrlToUploadServiceVideo(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }
    keyGeneratorDto.serviceId  = keyGeneratorDto.serviceId || uuidv4();
    const maxFileSize = 8;
    const allowedTypes = [ContentTypeEnum.VIDEO_MP4];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.VIDEO_MP4,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   // await this.serviceExternalService.updateServiceByIdOrThrow(keyGeneratorDto.serviceId,updateServiceDto)
    // } catch (error) {
    //   throw new Error(`Failed to save service videos with the given ServiceId`);
    // }
    return {key,signedUrl};
  }

  async getPresignedUrlToUploadOutletBannerImage(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }
    const maxFileSize = 1; // in MB
    const allowedTypes = [
      ContentTypeEnum.IMAGE_JPEG,
      ContentTypeEnum.IMAGE_PNG,
    ];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.IMAGE_JPEG,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   // await this.outletExternalService.updateOutletByIdOrThrow(keyGeneratorDto.outletId,updatedData);
    // } catch (error) {
    //   throw new Error(
    //     `Failed to save the profile photo for outlet with the given outletId`,
    //   );
    // }
    return {key,signedUrl};
  }

  async getPresignedUrlToUploadOutletVideo(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }    
    const maxFileSize = 8;
    const allowedTypes = [ContentTypeEnum.VIDEO_MP4];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.VIDEO_MP4,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   // await this.outletExternalService.updateOutletByIdOrThrow(keyGeneratorDto.outletId, updatedData);
    // } catch (error) {
    //   throw new Error(
    //     `Failed to save the video for outlet with the given outletId.`,
    //   );
    // }
    return {key,signedUrl};
  }

  async getPresignedUrlToUploadGst(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }
    const maxFileSize = 3;
    const allowedTypes = [
      ContentTypeEnum.APPLICATION_PDF,
      ContentTypeEnum.APPLICATION_MSWORD,
    ];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.APPLICATION_PDF,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   await this.outletExternalService.saveOutletGst(
    //     keyGeneratorDto.outletId,
    //     key,
    //   );
    // } catch (error) {
    //   throw new Error(
    //     `Failed to save the gst doc for outlet with the given outletId.`,
    //   );
    // }
    return {key,signedUrl};
  }

  async getPresignedUrlToUploadRegistration(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }    
    const maxFileSize = 3;
    const allowedTypes = [
      ContentTypeEnum.APPLICATION_PDF,
      ContentTypeEnum.APPLICATION_MSWORD,
    ];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.APPLICATION_PDF,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   await this.outletExternalService.saveOutletRegistration(
    //     keyGeneratorDto.outletId,
    //     key,
    //   );
    // } catch (error) {
    //   throw new Error(
    //     `Failed to save the registration doc for outlet with the given outletId.`,
    //   );
    // }
    return {key,signedUrl};
  }

  async getPresignedUrlToUploadMou(
    keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {

    if(!keyGeneratorDto.outletId){
      badRequest(`outletId is required`);
    }    
    const maxFileSize = 3;
    const allowedTypes = [
      ContentTypeEnum.APPLICATION_PDF,
      ContentTypeEnum.APPLICATION_MSWORD,
    ];
    const key = await this.keyGeneratorService.generateKey(keyGeneratorDto);
    const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(
      key,
      ContentTypeEnum.APPLICATION_PDF,
      maxFileSize,
      allowedTypes,
    );
    // try {
    //   await this.outletExternalService.saveOutletMou(
    //     keyGeneratorDto.outletId,
    //     key,
    //   );
    // } catch (error) {
    //   throw new Error(
    //     `Failed to save the MoU doc for outlet with the given outletId.`,
    //   );
    // }
    return {key,signedUrl};
  }

  async deleteFile(key:string):Promise<void>{
    return await this.awsS3Service.deleteFile(key);
  }
}