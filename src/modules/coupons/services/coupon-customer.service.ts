import {
    Injectable,
} from '@nestjs/common';
import { CouponStatusEnum } from '../enums/coupon-status.enum';
import { CouponEntity } from '../entities/coupon.entity';
import { CouponOutletMappingRepository } from '../repositories/coupon-outlet-mapping.repository';
import { CheckDiscountDto } from '../dtos/check-discount.dto';
import { CouponService } from './coupon.service';
import { calculateDiscount } from '@src/utils/helpers/calculate-discount';
import { ApplicableCouponDto } from '../dtos/applicable-coupon.dto';

@Injectable()
export class CouponCustomerService {
    constructor(
        private couponOutletMappingRepository: CouponOutletMappingRepository,
        private couponService: CouponService

    ) { }

    async getAllActiveCustomerCouponsByOutletId(
        outletId: number,
    ): Promise<CouponEntity[]> {
        const couponOutletMappings = await this.couponOutletMappingRepository
            .getRepository()
            .find({
                where: {
                    outlet: { id: outletId },
                    coupon: {
                        status: CouponStatusEnum.ACCEPTED, isActive: true,
                    },
                },
                relations: ['coupon', 'outlet'],
            });

        return couponOutletMappings.map((mapping) => mapping.coupon);
    }
    async getApplicableCoupons(
        outletId: number,
        totalPrice: number,
    ): Promise<ApplicableCouponDto[]> {
        const coupons = await this.getAllActiveCustomerCouponsByOutletId(outletId);

        return coupons.map((coupon) => {
            const applicableCoupon = new ApplicableCouponDto();
            Object.assign(applicableCoupon, coupon);
            applicableCoupon.applicable = coupon.minOrderValue ? totalPrice >= coupon.minOrderValue : true;
            return applicableCoupon;
        });
    }
    async getDiscountOnCoupon(
        checkDiscountDto: CheckDiscountDto
    ): Promise<number> {
        const { couponId, totalPrice } = checkDiscountDto;
        const coupon = await this.couponService.getCouponByIdOrThrow(couponId);
        return calculateDiscount(coupon, totalPrice);
    }



}
