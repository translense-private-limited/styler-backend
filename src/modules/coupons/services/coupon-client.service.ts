import { Injectable } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { OutletExternalService } from '@modules/client/outlet/services/outlet-external.service';
import { CouponOutletMappingService } from './coupon-outlet-mapping.service';

import { CouponEntity } from '../entities/coupon.entity';
import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';

import { CreateCouponClientDto } from '../dtos/create-coupon-client.dto';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';
import { AcceptRejectCouponCodeDto } from '../dtos/accept-reject-coupon-code.dto';
import { CouponActionEnum } from '../enums/coupon-action.enum';

@Injectable()
export class CouponClientService {
  constructor(
    private couponService: CouponService,
    private outletExternalService: OutletExternalService,
    private couponOutletMappingService: CouponOutletMappingService,
  ) {}

  async createCoupon(
    createCouponClientDto: CreateCouponClientDto,
  ): Promise<CouponOutletMappingEntity> {
    const { outletId, ...couponDto } = createCouponClientDto;

    // check wether coupon exist with provided code
    await this.doesCouponCodeExistForOutlet(
      createCouponClientDto.code,
      outletId,
    );

    const coupon = await this.couponService.create({
      ...couponDto,
      owner: UserTypeEnum.CLIENT,
    });

    const outlet =
      await this.outletExternalService.getOutletByIdOrThrow(outletId);

    return await this.couponOutletMappingService.createCouponOutletMapping(
      outlet,
      coupon,
    );
  }

  // return true if coupon exist with provided name
  async doesCouponCodeExistForOutlet(
    couponCode: string,
    outletId: number,
  ): Promise<boolean> {
    const coupon = await this.couponService.getCouponByCouponCode(couponCode);
    if (!coupon) {
      return false;
    }

    const isCouponBelongToOutlet = await this.isCouponBelongsToOutlet(
      coupon,
      outletId,
    );

    return isCouponBelongToOutlet;
  }

  private async isCouponBelongsToOutlet(
    coupon: CouponEntity,
    outletId: number,
  ): Promise<boolean> {
    const couponOutletMapping =
      await this.couponOutletMappingService.getByCouponAndOutletId(
        outletId,
        coupon.id,
      );
    return !!couponOutletMapping;
  }

  // list all coupon code published by admin
  async getAllCouponCodePublishedByAdmin(): Promise<CouponEntity[]> {
    return await this.couponService.getAll();
  }

  async acceptRejectCouponCode(
    acceptRejectCouponCodeDto: AcceptRejectCouponCodeDto,
  ) {
    const { couponCodeId, outletId, flag } = acceptRejectCouponCodeDto;

    const coupon = await this.couponService.getCouponByIdOrThrow(couponCodeId);
    const outlet =
      await this.outletExternalService.getOutletByIdOrThrow(outletId);

    const couponOutletMapping =
      await this.couponOutletMappingService.getByCouponAndOutletId(
        outletId,
        couponCodeId,
      );

    if (flag === CouponActionEnum.ACCEPT) {
      if (!couponOutletMapping) {
        await this.couponOutletMappingService.createCouponOutletMapping(
          outlet,
          coupon,
        );
      }
    } else {
      await this.couponOutletMappingService.softDelete(couponOutletMapping.id);
    }
  }

  async getAllActiveCouponCode(outletId: number): Promise<CouponEntity[]> {
    return await this.couponOutletMappingService.getAllActiveCouponsByOutletId(
      outletId,
    );
  }
}
