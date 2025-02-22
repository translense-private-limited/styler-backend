import { Injectable } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { OutletExternalService } from '@modules/client/outlet/services/outlet-external.service';
import { CouponOutletMappingService } from './coupon-outlet-mapping.service';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { CouponEntity } from '../entities/coupon.entity';
import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';

@Injectable()
export class CouponAdminService {
  constructor(
    private couponService: CouponService,
    private outletExternalService: OutletExternalService,
    private couponOutletMappingService: CouponOutletMappingService,
  ) {}

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
}
