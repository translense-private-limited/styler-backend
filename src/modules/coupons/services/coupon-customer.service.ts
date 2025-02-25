import {
    Injectable,
} from '@nestjs/common';
import { CouponEntity } from '../entities/coupon.entity';
import { CheckCouponApplicabilityDto } from '../dtos/check-coupon-applicability-dto';
import { CouponService } from './coupon.service';
import { ApplicableCouponEntity } from '../entities/applicable-coupon.entity';
import { CouponApplicabilityMetricsInterface } from '../interfaces/discount-check-interface';
import { evaluateCouponApplicability } from '@src/utils/helpers/evaluate-coupon-applicability';
import { CouponOutletMappingService } from './coupon-outlet-mapping.service';
import { ApplicableCouponsDto } from '../dtos/applicable-coupons-dto';

@Injectable()
export class CouponCustomerService {
    constructor(
        private couponOutletMappingService: CouponOutletMappingService,
        private couponService: CouponService

    ) { }

    async getAllActiveCouponsByOutletId(
        outletId: number,
    ): Promise<CouponEntity[]> {
        return await this.couponOutletMappingService.getAllCustomerCouponsByOutletId(outletId)
    }
    async getApplicableCouponsForOrder(
        queryParams: ApplicableCouponsDto
    ): Promise<ApplicableCouponEntity[]> {
        const { outletId, totalPrice } = queryParams;

        const coupons = await this.getAllActiveCouponsByOutletId(outletId);

        return coupons.map((coupon) => {
            const applicableCoupon = new ApplicableCouponEntity();
            Object.assign(applicableCoupon, coupon);
            applicableCoupon.applicable = coupon.minOrderValue ? totalPrice >= coupon.minOrderValue : true;
            return applicableCoupon;
        });
    }

    async getCouponApplicabilityMetrics(
        checkCouponApplicabilityDto: CheckCouponApplicabilityDto
    ): Promise<CouponApplicabilityMetricsInterface> {
        const { couponId, totalPrice } = checkCouponApplicabilityDto;

        const coupon = await this.couponService.getCouponByIdOrThrow(couponId);

        const discountAmount = evaluateCouponApplicability(coupon, totalPrice);
        const isApplicable = totalPrice >= (coupon.minOrderValue ?? 0);

        return {
            couponId: couponId,
            discountAmount,
            isApplicable,
        };
    }





}
