import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
import { ServiceExternalService } from "@modules/client/services/services/service-external.service";
import { ServiceSchema } from "@modules/client/services/schema/service.schema";
import { ServiceDto } from "@modules/client/services/dtos/service.dto";

@Injectable()
export class UploadFilesService {
  constructor(
    private readonly keyGeneratorService: KeyGeneratorService,
    private readonly awsS3Service: AwsS3Service,
    private readonly clientExternalService: ClientExternalService,
    private readonly outletExternalService: OutletExternalService,
    private readonly serviceExternalService:ServiceExternalService
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
  
  async updateOutletServiceKeys(outletId: number): Promise<void> {
    await this.outletExternalService.getOutletById(outletId);
    const services = await this.serviceExternalService.getAllServicesForAnOutlet(outletId);
  
    const updatedServices = [];
    const errors = [];
  
    for (const service of services) {
      try {
        const updatedKeys: Partial<ServiceDto> = { 
          serviceImages: [], 
          serviceVideos: [], 
          subtypes: [] 
        };
  
        // Call separate functions to handle updating images, videos, and subtypes
        await this.updateServiceImages(service, updatedKeys, outletId);
        await this.updateServiceVideos(service, updatedKeys, outletId);
        await this.updateSubtypes(service, updatedKeys, outletId);
  
        // Update the service in the database
        await this.serviceExternalService.updateServiceImageKeysById(service.id, updatedKeys);
  
        updatedServices.push({
          serviceId: service.id,
          updatedKeys,
        });
      } catch (error) {
        errors.push({
          serviceId: service.id,
          error: error.message,
        });
      }
    }
  }
  
  private async updateServiceImages(service: Partial<ServiceSchema>, updatedKeys: Partial<ServiceDto>, outletId: number): Promise<void> {
    if (service.serviceImages && service.serviceImages.length > 0) {
      for (const oldKey of service.serviceImages) {
        const newKey = await this.keyGeneratorService.generateKey({
          outletId,
          serviceId: service.id,
          mediaType: MediaTypeEnum.SERVICE_IMAGE,
        });
        await this.awsS3Service.moveFile(oldKey, newKey);
        updatedKeys.serviceImages.push(newKey);  // Correctly pushing into serviceImages array
      }
    }
  }
  
  private async updateServiceVideos(service: Partial<ServiceSchema>, updatedKeys: Partial<ServiceDto>, outletId: number): Promise<void> {
    if (service.serviceVideos && service.serviceVideos.length > 0) {
      for (const oldKey of service.serviceVideos) {
        const newKey = await this.keyGeneratorService.generateKey({
          outletId,
          serviceId: service.id,
          mediaType: MediaTypeEnum.SERVICE_VIDEO,
        });
        await this.awsS3Service.moveFile(oldKey, newKey);
        updatedKeys.serviceVideos.push(newKey);  // Correctly pushing into serviceVideos array
      }
    }
  }
  
  private async updateSubtypes(service: Partial<ServiceSchema>, updatedKeys: Partial<ServiceDto>, outletId: number): Promise<void> {
    if (service.subtypes && service.subtypes.length > 0) {
      const updatedSubtypes = [];
      for (const subtype of service.subtypes) {
        if (subtype.subtypeImages && subtype.subtypeImages.length > 0) {
          const updatedSubtypeImages = [];
          for (const oldKey of subtype.subtypeImages) {
            const newKey = await this.keyGeneratorService.generateKey({
              outletId,
              serviceId: service.id,
              mediaType: MediaTypeEnum.SERVICE_SUBTYPE_IMAGE,
            });
            await this.awsS3Service.moveFile(oldKey, newKey);
            updatedSubtypeImages.push(newKey);  // Adding updated subtype image
          }
          updatedSubtypes.push({ ...subtype, subtypeImages: updatedSubtypeImages });
        } else {
          updatedSubtypes.push(subtype);  // No images, keep the subtype as is
        }
      }
      updatedKeys.subtypes = updatedSubtypes;  // Assigning the updated subtypes
    }
  }  

  async deleteMediaByKey(key: string, type: MediaTypeEnum): Promise<void> {
    try {
      // Step 1: Attempt to delete the file from AWS S3
      await this.awsS3Service.deleteFile(key);

      // Step 2: Perform database deletion based on the media type
      switch (type) {
        case MediaTypeEnum.SERVICE_IMAGE:
          await this.serviceExternalService.deleteServiceImageKey(key);
          break;
        case MediaTypeEnum.SERVICE_VIDEO:
          await this.serviceExternalService.deleteServiceVideoKey(key);
          break;
        case MediaTypeEnum.SERVICE_SUBTYPE_IMAGE:
          await this.serviceExternalService.deleteServiceSubtypeImageKey(key);
          break;
        default:
          badRequest('Unsupported media type');
      }
      return;
    } catch (error) {
      throw new HttpException(`Error deleting the file: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

}