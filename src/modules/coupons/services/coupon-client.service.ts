import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { OutletExternalService } from '@modules/client/outlet/services/outlet-external.service';
import { CouponOutletMappingService } from './coupon-outlet-mapping.service';

import { CouponEntity } from '../entities/coupon.entity';
import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';

import { CreateCouponClientDto } from '../dtos/create-coupon-client.dto';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';
import { AcceptRejectCouponCodeDto } from '../dtos/accept-reject-coupon-code.dto';
import { CouponActionEnum } from '../enums/coupon-action.enum';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { CouponStatusEnum } from '../enums/coupon-status.enum';

@Injectable()
export class CouponClientService {
  constructor(
    private couponService: CouponService,
    private outletExternalService: OutletExternalService,
    private couponOutletMappingService: CouponOutletMappingService,
  ) { }

  async getCoupons(
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

  async delete(outletId: number, couponId: number): Promise<void> {
    const couponOutletMapping =
      await this.couponOutletMappingService.getByCouponAndOutletId(
        outletId,
        couponId,
      );
    const { coupon, outlet, id } = couponOutletMapping;
    if (!coupon || !outlet) {
      throw new NotFoundException(`Coupon not found `);
    }
    await this.couponOutletMappingService.softDelete(id);

    return;
  }

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
    return await this.couponService.getAllGlobalCoupons();
  }

  async acceptRejectCouponCode(
    acceptRejectCouponCodeDto: AcceptRejectCouponCodeDto,
  ): Promise<CouponOutletMappingEntity> {
    const { couponCodeId, outletId, flag } = acceptRejectCouponCodeDto;

    const coupon = await this.couponService.getCouponByIdOrThrow(couponCodeId);
    const outlet = await this.outletExternalService.getOutletByIdOrThrow(outletId);

    const couponOutletMapping = await this.couponOutletMappingService.getByCouponAndOutletId(
      outletId,
      couponCodeId,
    );

    if (couponOutletMapping) {
      couponOutletMapping.status = flag;
      if (flag === CouponActionEnum.ACCEPT) {
        coupon.status = CouponStatusEnum.ACCEPTED;
      } else {
        coupon.status = CouponStatusEnum.REJECTED;
      }
      await this.couponService.save(coupon);
      return await this.couponOutletMappingService.save(couponOutletMapping);
    } else {
      const newCouponOutletMapping = new CouponOutletMappingEntity();
      newCouponOutletMapping.coupon = coupon;
      newCouponOutletMapping.outlet = outlet;
      newCouponOutletMapping.status = flag;
      if (flag === CouponActionEnum.ACCEPT) {
        coupon.status = CouponStatusEnum.ACCEPTED;
      } else {
        coupon.status = CouponStatusEnum.REJECTED;
      }
      await this.couponService.save(coupon);
      return await this.couponOutletMappingService.save(newCouponOutletMapping);
    }
  }


  async getAllActiveGlobalCoupon(outletId: number): Promise<CouponEntity[]> {
    return await this.couponOutletMappingService.getAllActiveCouponsByOutletId(
      outletId,
    );
  }

  async getAllPendingGlobalCoupon(outletId: number): Promise<CouponEntity[]> {
    return await this.couponService.findUnmappedGlobalCouponsForOutlet(
      outletId,
    );
  }

  async updateCoupon(
    couponId: number,
    outletId: number,
    updateCouponDto: Partial<CreateCouponDto>,
  ): Promise<CouponEntity> {
    const couponOutletMapping =
      await this.couponOutletMappingService.getByCouponAndOutletId(
        outletId,
        couponId,
      );

    const { coupon, outlet } = couponOutletMapping;

    if (!coupon || !outlet) {
      throw new UnauthorizedException(
        'You are not authorized to update the coupon',
      );
    }

    const updatedCoupon = Object.assign(coupon, updateCouponDto);
    return await this.couponService.save(updatedCoupon);
  }
}
