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
import { ApplicableCouponEntity } from '../entities/applicable-coupon.entity';
import { ApplicableCouponsDto } from '../dtos/applicable-coupons-dto';
import { CouponApplicabilityMetricsInterface } from '../interfaces/discount-check-interface';
import { CheckCouponApplicabilityDto } from '../dtos/check-coupon-applicability-dto';

@Controller('customer')
@ApiTags('Coupons')
export class CouponCustomerController {
    constructor(
        private couponCustomerService: CouponCustomerService,

    ) { }

    @Get('coupons/outlet/:outletId')
    async getAllCouponsForOutlet(@Param('outletId') outletId: number,
    ): Promise<CouponEntity[]> {
        return await this.couponCustomerService.getAllActiveCouponsByOutletId(outletId);
    }
    @Get('coupons/outlet/:outletId/applicable')
    @ApiQuery({ name: 'totalPrice', type: Number, required: true })
    async getApplicableCouponsForOrder(
        @Param('outletId') outletId: number,
        @Query() queryParams: ApplicableCouponsDto,
    ): Promise<ApplicableCouponEntity[]> {
        return await this.couponCustomerService.getApplicableCouponsForOrder(queryParams);
    }

    @Post('coupon/applicability')
    async checkCouponApplicability(
        @Body() checkCouponApplicabilityDto: CheckCouponApplicabilityDto,
    ): Promise<CouponApplicabilityMetricsInterface> {
        return await this.couponCustomerService.getCouponApplicabilityMetrics(checkCouponApplicabilityDto);
    }

}
