import { Injectable } from "@nestjs/common";
import { KeyGeneratorService } from "./key-generator.service";
import { KeyGeneratorDto } from "../dtos/key-generator.dto";
import { AwsS3Service } from "@src/utils/aws/aws-s3.service";
import { ClientExternalService } from "@modules/client/client/services/client-external.service";
import { ServiceExternalService } from "@modules/client/services/services/service-external.service";
import { OutletExternalService } from "@modules/client/outlet/services/outlet-external.service";
import { CreateOutletDto } from "@modules/client/outlet/dtos/outlet.dto";
import { ServiceDto } from "@modules/client/services/dtos/service.dto";

@Injectable()
export class UploadFilesService{
    constructor(
        private readonly keyGeneratorService:KeyGeneratorService,
        private readonly awsS3Service:AwsS3Service,
        private readonly clientExternalService:ClientExternalService,
        private readonly serviceExternalService:ServiceExternalService,
        private readonly outletExternalService:OutletExternalService
    ){}
    async getSignedUrlForClientProfilePhotoUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            await this.clientExternalService.updateProfilePhoto(keyGeneratorDto.clientId, key);
         } catch (error) {
           throw new Error(`Failed to save the profile photo for client with given ClientId`);
         }
        return signedUrl;
    }

    async getSignedUrlForClientPanUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            await this.clientExternalService.saveClientPAN(keyGeneratorDto.clientId, key);
         } catch (error) {
           throw new Error(`Failed to save the PAN doc for client with the given ClientId`);
         }
        return signedUrl;
    }

    async getSignedUrlForClientAadharUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
        const key = await this.keyGeneratorService.generateKey(keyGeneratorDto)
        const signedUrl = await this.awsS3Service.generateSignedUrlForUpload(key,keyGeneratorDto.mediaType)
        try {
            await this.clientExternalService.saveClientAadhaar(keyGeneratorDto.clientId, key);
         } catch (error) {
           throw new Error(`Failed to save the Aadhar doc for client with the given ClientId`);
         }
        return signedUrl;
    }
    async getSignedUrlForServiceImageUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
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

    async getSignedUrlForServiceVideoUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
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

    async getSignedUrlForOutletBannerImageUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
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
    
    async getSignedUrlForOutletVideoUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
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
    
    async getSignedUrlForOutletGstUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
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

    async getSignedUrlForOutletRegistrationUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
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

    async getSignedUrlForOutletMouUpload(keyGeneratorDto:KeyGeneratorDto):Promise<string>{
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