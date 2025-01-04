import { Injectable } from '@nestjs/common';
import { KeyGeneratorDto } from '../dtos/key-generator.dto';
import { MediaTypeEnum } from '../enums/media-type.enum';
import { FileMetadataService } from '@src/utils/services/file-metadata.service';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';
import { OutletExternalService } from '@modules/client/outlet/services/outlet-external.service';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';

@Injectable()
export class KeyGeneratorService {
  constructor(
    private readonly fileMetadataService:FileMetadataService,
    private readonly clientExternalService:ClientExternalService,
    private readonly outletExternalService:OutletExternalService,
    private readonly serviceExternalService:ServiceExternalService
  ){}

  async generateKey(
    keyGeneratorDto:KeyGeneratorDto
  ):Promise<string>{
    const method = await  this.mediaTypeMethodMapper(keyGeneratorDto.mediaType);
    const key =  await method(keyGeneratorDto)
    await this.fileMetadataService.saveFileMetadata(keyGeneratorDto.outletId, key, keyGeneratorDto.mediaType);
    return key;
  }
  async mediaTypeMethodMapper(mediaType: MediaTypeEnum): Promise<(keyGeneratorDto: KeyGeneratorDto) => Promise<string>> {
    const mediaTypeMethodMap: Map<MediaTypeEnum, (keyGeneratorDto: KeyGeneratorDto) => Promise<string>> = new Map([
      [MediaTypeEnum.PAN, this.generateKeyForPAN.bind(this)], 
      [MediaTypeEnum.AADHAR, this.generateKeyForAadhaar.bind(this)],
      [MediaTypeEnum.PROFILE_PHOTO, this.generateKeyForProfilePhoto.bind(this)],
      [MediaTypeEnum.SERVICE_IMAGE, this.generateKeyForServiceImage.bind(this)],
      [MediaTypeEnum.SERVICE_VIDEO, this.generateKeyForServiceVideo.bind(this)],
      [MediaTypeEnum.OUTLET_BANNER, this.generateKeyForOutletImage.bind(this)],
      [MediaTypeEnum.OUTLET_VIDEO, this.generateKeyForOutletVideo.bind(this)],
      [MediaTypeEnum.OUTLET_GST, this.generateKeyForOutletGST.bind(this)],
      [MediaTypeEnum.OUTLET_REGISTRATION, this.generateKeyForOutletRegistration.bind(this)],
      [MediaTypeEnum.OUTLET_MOU, this.generateKeyForOutletMoU.bind(this)],
    ]);
  
    return mediaTypeMethodMap.get(mediaType);
  }
  
  private async generateKeyForPAN(keyGeneratorDto: KeyGeneratorDto): Promise<string> {

    if (!keyGeneratorDto.clientId) {
      throw new Error("Client ID is required to generate key.");
    }
  
    const { outletId, clientId } = keyGeneratorDto;
    const key = `${outletId}/clients/${clientId}/documents/PAN`;
    try {
      await this.clientExternalService.updateProfilePhoto(clientId, key);
   } catch (error) {
     throw new Error(`Failed to save the PAN doc for client with ID ${clientId}`);
   }

    return key;
  }

  private async generateKeyForAadhaar(keyGeneratorDto: KeyGeneratorDto): Promise<string> {

    if (!keyGeneratorDto.clientId) {
      throw new Error("Client ID is required to generate key.");
    }
  
    const { outletId, clientId } = keyGeneratorDto;
    const key = `${outletId}/clients/${clientId}/documents/Aadhar`;
    try {
      await this.clientExternalService.updateProfilePhoto(clientId, key);
   } catch (error) {
     throw new Error(`Failed to save the Aadhaar doc for client with ID ${clientId}`);
   }
    return key;
  }

  private async generateKeyForProfilePhoto(keyGeneratorDto: KeyGeneratorDto): Promise<string> {

    if (!keyGeneratorDto.clientId) {
      throw new Error("Client ID is required to generate key.");
    }
  
    const { outletId, clientId,count } = keyGeneratorDto;
    const key = `${outletId}/clients/${clientId}/images/${clientId}-${count}.jpeg`;
    try {
      await this.clientExternalService.updateProfilePhoto(clientId, key);
   } catch (error) {
     throw new Error(`Failed to save the profile photo for client with ID ${clientId}`);
   }
    return key;
  }

  private async generateKeyForServiceImage(keyGeneratorDto: KeyGeneratorDto): Promise<string> {

    if (!keyGeneratorDto.serviceId) {
      throw new Error("Service ID is required to generate key.");
    }
  
    const { outletId, serviceId,count } = keyGeneratorDto;
    const key = `${outletId}/services/${serviceId}/images/${serviceId}-${count}.jpeg`;
    try {
      await this.serviceExternalService.updateServiceImages(serviceId,key)
      }
      catch (error) {
      throw new Error(`Failed to save service images with ID ${serviceId}.`);
      }
    return key;
  }

  private async generateKeyForServiceVideo(keyGeneratorDto: KeyGeneratorDto): Promise<string> {

    if (!keyGeneratorDto.serviceId) {
      throw new Error("Service ID is required to generate key.");
    }
  
    const { outletId, serviceId,count } = keyGeneratorDto;
    const key = `${outletId}/services/${serviceId}/videos/${serviceId}-${count}.mp4`;
    try {
      await this.serviceExternalService.updateServiceVideos(serviceId,key)
      }
      catch (error) {
      throw new Error(`Failed to save service videos with ID ${serviceId}.`);
      }
    return key;
  }

  private async generateKeyForOutletImage(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId,count } = keyGeneratorDto;
    const key = `${outletId}/outlets/${outletId}/images/${outletId}-${count}.jpeg`;
    try {
    await this.outletExternalService.updateOutletBannerImages(outletId, key);
    }
    catch (error) {
    throw new Error(`Failed to save the profile photo for outlet with ID ${outletId}.`);
    }
    return key;
  }

  private async generateKeyForOutletVideo(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId,count } = keyGeneratorDto;
    const key = `${outletId}/outlets/${outletId}/videos/${outletId}-${count}.mp4`;
    try {
      await this.outletExternalService.updateOutletBannerImages(outletId, key);
    }
    catch (error) {
      throw new Error(`Failed to save the video for outlet with ID ${outletId}.`);
    }
    return key;
  }

  private async generateKeyForOutletGST(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId } = keyGeneratorDto;
    const key = `${outletId}/outlets/${outletId}/documents/gst`;
    try {
      await this.outletExternalService.saveOutletGst(outletId, key);
    }
    catch (error) {
      throw new Error(`Failed to save the gst doc for outlet with ID ${outletId}.`);
    }
    return key;
  }
  private async generateKeyForOutletRegistration(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId } = keyGeneratorDto;
    const key = `${outletId}/outlets/${outletId}/documents/registration`;
    try {
      await this.outletExternalService.saveOutletRegistration(outletId, key);
    }
    catch (error) {
      throw new Error(`Failed to save the registration doc for outlet with ID ${outletId}.`);
    }
    return key;
  }
  private async generateKeyForOutletMoU(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId } = keyGeneratorDto;
    const key = `${outletId}/outlets/${outletId}/documents/MoU`;
    try {
      await this.outletExternalService.saveOutletMou(outletId, key);
    }
    catch (error) {
      throw new Error(`Failed to save the MoU doc for outlet with ID ${outletId}.`);
    }
    return key;
  }
}
