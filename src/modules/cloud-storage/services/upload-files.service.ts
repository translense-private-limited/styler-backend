import { Injectable } from "@nestjs/common";
import { KeyGeneratorService } from "./key-generator.service";
import { KeyGeneratorDto } from "../dtos/key-generator.dto";
import { AwsS3Service } from "@src/utils/aws/aws-s3.service";
import { ClientExternalService } from "@modules/client/client/services/client-external.service";
import { ServiceExternalService } from "@modules/client/services/services/service-external.service";
import { OutletExternalService } from "@modules/client/outlet/services/outlet-external.service";
import { CreateOutletDto } from "@modules/client/outlet/dtos/outlet.dto";
import { ServiceDto } from "@modules/client/services/dtos/service.dto";
import { MediaTypeEnum } from "../enums/media-type.enum";
import { badRequest } from "@src/utils/exceptions/common.exception";

@Injectable()
export class UploadFilesService{
    constructor(
        private readonly keyGeneratorService:KeyGeneratorService,
        private readonly awsS3Service:AwsS3Service,
        private readonly clientExternalService:ClientExternalService,
        private readonly serviceExternalService:ServiceExternalService,
        private readonly outletExternalService:OutletExternalService
    ){}

    async generatePreSignedUrlToUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
      const method = await this.mediaTypeMethodMapper(keyGeneratorDto.mediaType);
      return await method(keyGeneratorDto);
    }

    private async mediaTypeMethodMapper(mediaType: MediaTypeEnum): Promise<(keyGeneratorDto: KeyGeneratorDto) => Promise<string>> {
      const mediaTypeMethodMap: Map<MediaTypeEnum, (keyGeneratorDto: KeyGeneratorDto) => Promise<string>> = new Map([
        [MediaTypeEnum.PAN, this.getPresignedUrlToUploadPan.bind(this)], 
        [MediaTypeEnum.AADHAR, this.getPresignedUrlToUploadAadhar.bind(this)],
        [MediaTypeEnum.PROFILE_PHOTO, this.getPresignedUrlToUploadProfilePhoto.bind(this)],
        [MediaTypeEnum.SERVICE_IMAGE, this.getPresignedUrlToUploadServiceImage.bind(this)],
        [MediaTypeEnum.SERVICE_VIDEO, this.getPresignedUrlToUploadServiceVideo.bind(this)],
        [MediaTypeEnum.OUTLET_BANNER, this.getPresignedUrlToUploadOutletBannerImage.bind(this)],
        [MediaTypeEnum.OUTLET_VIDEO, this.getPresignedUrlToUploadOutletVideo.bind(this)],
        [MediaTypeEnum.OUTLET_GST, this.getPresignedUrlToUploadGst.bind(this)],
        [MediaTypeEnum.OUTLET_REGISTRATION, this.getPresignedUrlToUploadRegistration.bind(this)],
        [MediaTypeEnum.OUTLET_MOU, this.getPresignedUrlToUploadMou.bind(this)],
      ]);
    
      return mediaTypeMethodMap.get(mediaType);
    }

    async getPresignedUrlToUploadProfilePhoto(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.clientId) {
          badRequest('ClientId is required')
        }
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
          // await this.clientExternalService.updateProfilePhoto(keyGeneratorDto.clientId, key);
        } catch (error) {
            throw new Error(`Failed to save the profile photo for client with given ClientId`);
        }
        return signedUrl;
    }

    async getPresignedUrlToUploadPan(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.clientId) {
          badRequest('ClientId is required')
        }
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            await this.clientExternalService.saveClientPAN(keyGeneratorDto.clientId, key);
         } catch (error) {
           throw new Error(`Failed to save the PAN doc for client with the given ClientId`);
         }
        return signedUrl;
    }

    async getPresignedUrlToUploadAadhar(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.clientId) {
          badRequest('ClientId is required')
        }
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            await this.clientExternalService.saveClientAadhaar(keyGeneratorDto.clientId, key);
         } catch (error) {
           throw new Error(`Failed to save the Aadhar doc for client with the given ClientId`);
         }
        return signedUrl;
    }
    async getPresignedUrlToUploadServiceImage(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.clientId) {
          badRequest('Service is required')
        }
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            const updateServiceDto:Partial<ServiceDto> = {serviceImages:[key]}
            await this.serviceExternalService.updateServiceByIdOrThrow(keyGeneratorDto.serviceId,updateServiceDto)
            }
            catch (error) {
            throw new Error(`Failed to save service images with the given serviceId`);
            }
        return signedUrl;
    }

    async getPresignedUrlToUploadServiceVideo(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.clientId) {
          badRequest('ServiceId is required')
        }
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            const updateServiceDto:Partial<ServiceDto> = {serviceVideos:[key]}
            await this.serviceExternalService.updateServiceByIdOrThrow(keyGeneratorDto.serviceId,updateServiceDto)
            }
            catch (error) {
            throw new Error(`Failed to save service videos with the given ServiceId`);
            }
        return signedUrl;
    }  

    async getPresignedUrlToUploadOutletBannerImage(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            const updatedData: Partial<CreateOutletDto> = { outletBannerImages: [key] }
            await this.outletExternalService.updateOutletByIdOrThrow(keyGeneratorDto.outletId,updatedData);
            }
            catch (error) {
            throw new Error(`Failed to save the profile photo for outlet with the given outletId`);
            }
        return signedUrl;
    }
    
    async getPresignedUrlToUploadOutletVideo(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            const updatedData: Partial<CreateOutletDto> = { outletVideos: [key] }
            await this.outletExternalService.updateOutletByIdOrThrow(keyGeneratorDto.outletId, updatedData);
          }
          catch (error) {
            throw new Error(`Failed to save the video for outlet with the given outletId.`);
          }
        return signedUrl;
    }
    
    async getPresignedUrlToUploadGst(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            await this.outletExternalService.saveOutletGst(keyGeneratorDto.outletId, key);
          }
          catch (error) {
            throw new Error(`Failed to save the gst doc for outlet with the given outletId.`);
          }
        return signedUrl;
    }

    async getPresignedUrlToUploadRegistration(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            await this.outletExternalService.saveOutletRegistration(keyGeneratorDto.outletId, key);
          }
          catch (error) {
            throw new Error(`Failed to save the registration doc for outlet with the given outletId.`);
          }
        return signedUrl;
    }

    async getPresignedUrlToUploadMou(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        if (!keyGeneratorDto.outletId) {
          badRequest('OutletId is required')
        }
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            await this.outletExternalService.saveOutletMou(keyGeneratorDto.outletId, key);
          }
          catch (error) {
            throw new Error(`Failed to save the MoU doc for outlet with the given outletId.`);
          }
        return signedUrl;
    }

}