import { Injectable } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { OutletExternalService } from '@modules/client/outlet/services/outlet-external.service';
import { CouponOutletMappingService } from './coupon-outlet-mapping.service';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { CouponEntity } from '../entities/coupon.entity';
import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';
import { CouponClientService } from './coupon-client.service';
import { CreateCouponClientDto } from '../dtos/create-coupon-client.dto';
import { CouponStatusEnum } from '../enums/coupon-status.enum';
import { AcceptRejectCouponCodeDto } from '../dtos/accept-reject-coupon-code.dto';
import { CouponInterface } from '../interfaces/coupon.interface';
import { CouponCheckResponseInterface } from '../interfaces/coupon-check-response.interface';

@Injectable()
export class CouponAdminService {
  constructor(
    private couponService: CouponService,
    private couponClientService: CouponClientService,
    private outletExternalService: OutletExternalService,
    private couponOutletMappingService: CouponOutletMappingService,
  ) { }

  async createCoupon(
    createCouponDto: CreateCouponDto,
  ): Promise<CouponEntity | CouponOutletMappingEntity> {
    const { outletId, ...couponDto } = createCouponDto;
    const coupon = await this.couponService.create({
      ...couponDto,
      owner: UserTypeEnum.ADMIN,
    });

    if (outletId) {
      const outlet =
        await this.outletExternalService.getOutletByIdOrThrow(outletId);
      const couponOutletMappingResponse =
        await this.couponOutletMappingService.createCouponOutletMapping(
          outlet,
          coupon,
        );

      return couponOutletMappingResponse;
    }
    return coupon;
  }

  async createCouponForOutlet(
    createCouponClientDto: CreateCouponClientDto,
  ): Promise<CouponOutletMappingEntity> {
    return this.couponClientService.createCoupon(createCouponClientDto)
  }

  async getCouponsForOutlet(
    outletId: number,
    status?: CouponStatusEnum,
  ): Promise<CouponEntity[]> {
    const coupons =
      await this.couponOutletMappingService.getAllCouponsByOutletId(
        outletId,
        status,
      );
    return coupons;
  }

  async acceptRejectCouponForOutlet(
    acceptRejectCouponCodeDto: AcceptRejectCouponCodeDto,
  ): Promise<boolean> {
    await this.couponClientService.acceptRejectCouponCode(
      acceptRejectCouponCodeDto,
    );
    return true;
  }

  async getAllActiveGlobalCouponForOutlet(outletId: number): Promise<CouponEntity[]> {
    return await this.couponOutletMappingService.getAllActiveCouponsByOutletId(
      outletId,
    );
  }

  async getAllPendingGlobalCouponForOutlet(outletId: number): Promise<CouponEntity[]> {
    return await this.couponService.findUnmappedGlobalCouponsForOutlet(
      outletId,
    );
  }

  async updateCouponForOutlet(
    couponId: number,
    outletId: number,
    updateCouponDto: Partial<CreateCouponDto>,
  ): Promise<CouponInterface> {
    return this.couponClientService.updateCoupon(
      couponId,
      outletId,
      updateCouponDto,
    );
  }

  async deleteCouponForOutlet(outletId: number, couponId: number): Promise<void> {
    return this.couponClientService.delete(outletId, couponId);
  }

  async isCouponCodeUniqueForOutlet(
    couponCode: string,
    outletId: number,
  ): Promise<CouponCheckResponseInterface> {
    const response =
      await this.couponClientService.doesCouponCodeExistForOutlet(
        couponCode,
        outletId,
      );

    if (!response) {
      return {
        success: true,
        message: 'Coupon code is unique.',
        isUnique: true,
        coupon: couponCode,
      };
    }
    return {
      success: false,
      message:
        'The coupon code is already present with the provided code. Please choose a unique code.',
      isUnique: false,
      coupon: couponCode,
    };
  }

}
