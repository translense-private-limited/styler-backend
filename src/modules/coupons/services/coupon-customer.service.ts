import {
    Injectable,
} from '@nestjs/common';
import { CouponEntity } from '../entities/coupon.entity';
import { CheckDiscountDto } from '../dtos/check-discount.dto';
import { CouponService } from './coupon.service';
import { ApplicableCouponEntity } from '../entities/applicable-coupon.entity';
import { DiscountCheckResponseInterface } from '../interfaces/discount-check-interface';
import { getCouponDiscountAmount } from '@src/utils/helpers/calculate-discount';
import { CouponOutletMappingService } from './coupon-outlet-mapping.service';

@Injectable()
export class CouponCustomerService {
    constructor(
        private couponOutletMappingService: CouponOutletMappingService,
        private couponService: CouponService

    ) { }

    async getAllActiveCustomerCouponsByOutletId(
        outletId: number,
    ): Promise<CouponEntity[]> {
        return await this.couponOutletMappingService.getAllCustomerCouponsByOutletId(outletId)
    }
    async getApplicableCoupons(
        outletId: number,
        totalPrice: number,
    ): Promise<ApplicableCouponEntity[]> {
        const coupons = await this.getAllActiveCustomerCouponsByOutletId(outletId);

        return coupons.map((coupon) => {
            const applicableCoupon = new ApplicableCouponEntity();
            Object.assign(applicableCoupon, coupon);
            applicableCoupon.applicable = coupon.minOrderValue ? totalPrice >= coupon.minOrderValue : true;
            return applicableCoupon;
        });
    }
    async getDiscountOnCoupon(
        checkDiscountDto: CheckDiscountDto
    ): Promise<DiscountCheckResponseInterface> {
        const { couponId, totalPrice } = checkDiscountDto;
        const coupon = await this.couponService.getCouponByIdOrThrow(couponId);

        return {
            couponId,
            totalDiscount: getCouponDiscountAmount(coupon, totalPrice),
        };
    }




}
