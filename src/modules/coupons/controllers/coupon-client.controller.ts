import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { CouponService } from '../services/coupon.service';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { CouponInterface } from '../interfaces/coupon.interface';
import { ApiTags } from '@nestjs/swagger';
import { CouponCheckResponseInterface } from '../interfaces/coupon-check-response.interface';
import { CouponAdminService } from '../services/coupon-admin.service';
import { CouponEntity } from '../entities/coupon.entity';
import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';

import { CreateCouponClientDto } from '../dtos/create-coupon-client.dto';
import { CouponClientService } from '../services/coupon-client.service';

@Controller('client')
@ApiTags('Coupons')
export class CouponClientController {
  constructor(
    private couponService: CouponService,
    private couponAdminService: CouponAdminService,
    private couponClientService: CouponClientService,
  ) {}

  @Post('coupon')
  async createCoupon(
    @Body() createCouponDto: CreateCouponClientDto,
  ): Promise<CouponOutletMappingEntity> {
    return this.couponClientService.createCoupon(createCouponDto);
  }

  @Get('coupons')
  async getCoupons(): Promise<CouponInterface[]> {
    return this.couponService.findAll();
  }

  @Get('coupon/outlet/:outletId/is-coupon-code-unique/:couponCode')
  async isCouponCodeUnique(
    @Param('couponCode') couponCode: string,
    @Param('outletId') outletId: number,
  ): Promise<CouponCheckResponseInterface> {
    const response =
      await this.couponClientService.doesCouponCodeExistForOutlet(
        couponCode,
        outletId,
      );

    if (!response) {
      // you cannot create
      return {
        success: true,
        message: 'Coupon code is unique.',
        isUnique: true,
        coupon: couponCode,
      };
    }
    return {
      success: false,
      message:
        'The coupon code is already present with the provided code. Please choose a unique code.',
      isUnique: false,
      coupon: couponCode,
    };
  }

  @Get('coupon/:id')
  async getCouponById(@Param('id') id: number): Promise<CouponInterface> {
    return this.couponService.findOne(id);
  }

  @Patch('coupon/:id')
  async updateCoupon(
    @Param('id') id: number,
    @Body() updateCouponDto: Partial<CreateCouponDto>,
  ): Promise<CouponInterface> {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete('coupon/:id')
  @HttpCode(204)
  async deleteCoupon(@Param('id') id: number): Promise<void> {
    return this.couponService.delete(id);
  }
}
