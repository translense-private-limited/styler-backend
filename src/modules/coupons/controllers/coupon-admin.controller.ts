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

@Controller('admin')
@ApiTags('Coupons')
export class CouponAdminController {
  constructor(private couponService: CouponService) {}

  @Get('coupon/is-coupon-code-unique/:couponCode')
  async isCouponCodeUnique(
    @Param('couponCode') couponCode: string,
  ): Promise<boolean> {
    return this.couponService.isCouponCodeUnique(couponCode);
  }

  @Post('coupon')
  async createCoupon(
    @Body() createCouponDto: CreateCouponDto,
  ): Promise<CouponInterface> {
    return this.couponService.create(createCouponDto);
  }

  @Get('coupons')
  async getCoupons(): Promise<CouponInterface[]> {
    return this.couponService.findAll();
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
