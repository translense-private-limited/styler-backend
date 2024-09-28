import { Injectable } from '@nestjs/common';
import { KeyGeneratorService } from './key-generator.service';
import { GcpService } from '@modules/libs/gcp/services/gcp.service';
import { GenerateSignedPostPolicyV4Response } from '@google-cloud/storage';

@Injectable()
export class UploadFiles {
  constructor(
    private keyGeneratorService: KeyGeneratorService,
    private gcpService: GcpService,
  ) {}

  async generateSignedPolicyForGstUpload(
    businessId: number,
  ): Promise<GenerateSignedPostPolicyV4Response> {
    const key = await this.keyGeneratorService.getGstKey(businessId);
    return await this.gcpService.generateV4SignedPolicy(key);
  }

  async generateSignedPolicyForFssaiUpload(
    businessId: number,
  ): Promise<GenerateSignedPostPolicyV4Response> {
    const key = await this.keyGeneratorService.getFssaiKey(businessId);
    return await this.gcpService.generateV4SignedPolicy(key);
  }

  async generateSignedPolicyForMouUpload(
    businessId: number,
  ): Promise<GenerateSignedPostPolicyV4Response> {
    const key = await this.keyGeneratorService.getMouKey(businessId);
    return await this.gcpService.generateV4SignedPolicy(key);
  }

  async generateSignedPolicyForAdharUpload(
    businessId: number,
    userId: number,
  ): Promise<GenerateSignedPostPolicyV4Response> {
    const key = await this.keyGeneratorService.getAdharKey(businessId, userId);
    return await this.gcpService.generateV4SignedPolicy(key);
  }

  async generateSignedPolicyForPanUpload(
    businessId: number,
    userId: number,
  ): Promise<GenerateSignedPostPolicyV4Response> {
    const key = await this.keyGeneratorService.getPanKey(businessId, userId);
    return await this.gcpService.generateV4SignedPolicy(key);
  }

  async generateSignedPolicyForProfilePicUpload(
    businessId: number,
    userId: number,
  ): Promise<GenerateSignedPostPolicyV4Response> {
    const key = await this.keyGeneratorService.getClientProfileKey(
      businessId,
      userId,
    );
    return await this.gcpService.generateV4SignedPolicy(key);
  }
}
