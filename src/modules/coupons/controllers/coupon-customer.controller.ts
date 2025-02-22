import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CouponEntity } from '../entities/coupon.entity';

import { CouponCustomerService } from '../services/coupon-customer.service';
import { CheckDiscountDto } from '../dtos/check-discount.dto';
import { CouponService } from '../services/coupon.service';
import { ApplicableCouponDto } from '../dtos/applicable-coupon.dto';

@Controller('customer')
@ApiTags('Coupons')
export class CouponCustomerController {
    constructor(
        private couponCustomerService: CouponCustomerService,
        private couponService: CouponService

    ) { }

    @Get('coupons/:outletId')
    async getAllCoupons(@Param('outletId') outletId: number,
    ): Promise<CouponEntity[]> {
        return await this.couponCustomerService.getAllActiveCustomerCouponsByOutletId(outletId);
    }
    @Get('coupons/:outletId/applicable')
    @ApiQuery({ name: 'totalPrice', type: Number, required: true })
    async getApplicableCoupons(
        @Param('outletId') outletId: number,
        @Query('totalPrice') totalPrice: number,
    ): Promise<ApplicableCouponDto[]> {
        return await this.couponCustomerService.getApplicableCoupons(outletId, totalPrice);
    }

    @Post('coupon/discount')
    async checkDiscount(
        @Body() checkDiscountDto: CheckDiscountDto,
    ): Promise<number> {
        return await this.couponCustomerService.getDiscountOnCoupon(checkDiscountDto);
    }
}
