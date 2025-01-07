import { Injectable } from '@nestjs/common';
import { KeyGeneratorDto } from '../dtos/key-generator.dto';
import { MediaTypeEnum } from '../enums/media-type.enum';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OutletExternalService } from '@modules/client/outlet/services/outlet-external.service';

@Injectable()
export class KeyGeneratorService {
  constructor(
    private readonly serviceExternalService:ServiceExternalService,
    private readonly outletExternalService:OutletExternalService
  ){}
  async generateKey(
    keyGeneratorDto:KeyGeneratorDto
  ):Promise<string>{
    const method = await  this.mediaTypeMethodMapper(keyGeneratorDto.mediaType);
    const key =  await method(keyGeneratorDto)
    return key;
  }
  private async mediaTypeMethodMapper(mediaType: MediaTypeEnum): Promise<(keyGeneratorDto: KeyGeneratorDto) => Promise<string>> {
    const mediaTypeMethodMap: Map<MediaTypeEnum, (keyGeneratorDto: KeyGeneratorDto) => Promise<string>> = new Map([
      [MediaTypeEnum.PAN, this.generateKeyForClientPAN.bind(this)], 
      [MediaTypeEnum.AADHAR, this.generateKeyForClientAadhaar.bind(this)],
      [MediaTypeEnum.PROFILE_PHOTO, this.generateKeyForClientProfilePhoto.bind(this)],
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
  
  private async generateKeyForClientPAN(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId, clientId } = keyGeneratorDto;
    const key = `${outletId}/clients/${clientId}/documents/PAN`;
    return key;
  }

  private async generateKeyForClientAadhaar(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId, clientId } = keyGeneratorDto;
    const key = `${outletId}/clients/${clientId}/documents/Aadhar`;
    return key;
  }

  private async generateKeyForClientProfilePhoto(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId, clientId,count } = keyGeneratorDto;
    const key = `${outletId}/clients/${clientId}/images/${clientId}-${count}.jpeg`;
    return key;
  }

  private async generateKeyForServiceImage(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId, serviceId } = keyGeneratorDto;
    const count = (await this.serviceExternalService.getServiceImagesCountById(serviceId))+1;
    const key = `${outletId}/services/${serviceId}/images/${serviceId}-${count}.jpeg`;
    return key;
  }

  private async generateKeyForServiceVideo(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId, serviceId } = keyGeneratorDto;
    const count = (await this.serviceExternalService.getServiceVideosCountById(serviceId))+1;
    const key = `${outletId}/services/${serviceId}/videos/${serviceId}-${count}.mp4`;
    return key;
  }

  private async generateKeyForOutletImage(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId } = keyGeneratorDto;
    const count = (await this.outletExternalService.getOutletBannerImagesCountById(outletId))+1;
    const key = `${outletId}/outlets/${outletId}/images/${outletId}-${count}.jpeg`;
    return key;
  }

  private async generateKeyForOutletVideo(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId } = keyGeneratorDto;
    const count = (await this.outletExternalService.getOutletVideosCountById(outletId))+1;
    const key = `${outletId}/outlets/${outletId}/videos/${outletId}-${count}.mp4`;
    return key;
  }

  private async generateKeyForOutletGST(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId } = keyGeneratorDto;
    const key = `${outletId}/outlets/${outletId}/documents/gst`;
    return key;
  }
  private async generateKeyForOutletRegistration(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId } = keyGeneratorDto;
    const key = `${outletId}/outlets/${outletId}/documents/registration`;
    return key;
  }
  private async generateKeyForOutletMoU(keyGeneratorDto: KeyGeneratorDto): Promise<string> {
    const { outletId } = keyGeneratorDto;
    const key = `${outletId}/outlets/${outletId}/documents/MoU`;
    return key;
  }
}
