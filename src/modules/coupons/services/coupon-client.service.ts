import { Injectable } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { OutletExternalService } from '@modules/client/outlet/services/outlet-external.service';
import { CouponOutletMappingService } from './coupon-outlet-mapping.service';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { CouponEntity } from '../entities/coupon.entity';
import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';
import { CreateClientDto } from '@modules/client/client/dtos/client.dto';
import { CreateCouponClientDto } from '../dtos/create-coupon-client.dto';

@Injectable()
export class CouponClientService {
  constructor(
    private couponService: CouponService,
    private outletExternalService: OutletExternalService,
    private couponOutletMappingService: CouponOutletMappingService,
  ) {}

  async createCoupon(
    createCouponClientDto: CreateCouponClientDto,
  ): Promise<CouponEntity | CouponOutletMappingEntity> {
    const { outletId, ...couponDto } = createCouponDto;
    const coupon = await this.couponService.create(couponDto);

    if (outletId) {
      const outlet = await this.outletExternalService.getOutletById(outletId);
      const couponOutletMappingResponse =
        await this.couponOutletMappingService.createCouponOutletMapping(
          outlet,
          coupon,
        );

      return couponOutletMappingResponse;
    }
    return coupon;
  }

  async isCouponCodeUnique(couponCode: string): Promise<boolean> {}

  private async;
}
