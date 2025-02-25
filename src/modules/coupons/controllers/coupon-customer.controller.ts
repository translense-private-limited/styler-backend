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
import { ApplicableCouponEntity } from '../entities/applicable-coupon.entity';
import { ApplicableCouponsDto } from '../dtos/applicable-coupons-dto';
import { DiscountCheckResponseInterface } from '../interfaces/discount-check-interface';

@Controller('customer')
@ApiTags('Coupons')
export class CouponCustomerController {
    constructor(
        private couponCustomerService: CouponCustomerService,

    ) { }

    @Get('coupons/outlet/:outletId')
    async getAllCouponsForOutlet(@Param('outletId') outletId: number,
    ): Promise<CouponEntity[]> {
        return await this.couponCustomerService.getAllActiveCustomerCouponsByOutletId(outletId);
    }
    @Get('coupons/outlet/:outletId/applicable')
    @ApiQuery({ name: 'totalPrice', type: Number, required: true })
    async getApplicableCouponsForOrder(
        @Param('outletId') outletId: number,
        @Query() queryParams: ApplicableCouponsDto,
    ): Promise<ApplicableCouponEntity[]> {
        return await this.couponCustomerService.getApplicableCoupons(outletId, queryParams.totalPrice);
    }

    @Post('coupon/discount')
    async checkDiscount(
        @Body() checkDiscountDto: CheckDiscountDto,
    ): Promise<DiscountCheckResponseInterface> {
        return await this.couponCustomerService.getDiscountOnCoupon(checkDiscountDto);
    }
}
