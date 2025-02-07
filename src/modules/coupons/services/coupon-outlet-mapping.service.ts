import { Injectable } from '@nestjs/common';
import { CouponOutletMappingRepository } from '../repositories/coupon-outlet-mapping.repository';
import { OutletEntity } from '@modules/client/outlet/entities/outlet.entity';
import { CouponEntity } from '../entities/coupon.entity';
import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';

@Injectable()
export class CouponOutletMappingService {
  constructor(
    private couponOutletMappingRepository: CouponOutletMappingRepository,
  ) {}

  async createCouponOutletMapping(
    outlet: OutletEntity,
    coupon: CouponEntity,
  ): Promise<CouponOutletMappingEntity> {
    return await this.couponOutletMappingRepository
      .getRepository()
      .save({ outlet, coupon });
  }

  async getByCouponAndOutletId(
    outletId: number,
    couponId: number,
  ): Promise<CouponOutletMappingEntity> {
    const couponOutletMapping = await this.couponOutletMappingRepository
      .getRepository()
      .findOne({
        where: {
          coupon: { id: couponId },
          outlet: { id: outletId },
        },
      });
    return couponOutletMapping;
  }
}
