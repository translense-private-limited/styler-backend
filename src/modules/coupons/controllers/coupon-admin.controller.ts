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
import { CouponClientService } from '../services/coupon-client.service';
import { CreateCouponClientDto } from '../dtos/create-coupon-client.dto';

@Controller('admin')
@ApiTags('Coupons')
export class CouponAdminController {
  constructor(
    private couponService: CouponService,
    private couponAdminService: CouponAdminService,
    private couponClientService: CouponClientService,

  ) { }

  @Post('coupon')
  async createCoupon(
    @Body() createCouponDto: CreateCouponDto,
  ): Promise<CouponEntity | CouponOutletMappingEntity> {
    return this.couponAdminService.createCoupon(createCouponDto);
  }

  @Post('outlet/coupon')
  async createCouponForOutlet(
    @Body() createCouponDto: CreateCouponClientDto,
  ): Promise<CouponOutletMappingEntity> {
    return this.couponClientService.createCoupon(createCouponDto);
  }

  @Get('coupons')
  async getCoupons(): Promise<CouponInterface[]> {
    return this.couponService.getAll();
  }

  @Get('coupons/outlet/:outletId')
  async getCouponsByOutletId(
    @Param('outletId') outletId: number,
  ): Promise<CouponInterface[]> {
    return this.couponClientService.getCoupons(outletId);
  }

  @Get('coupon/is-coupon-code-unique/:couponCode')
  async isCouponCodeUnique(
    @Param('couponCode') couponCode: string,
  ): Promise<CouponCheckResponseInterface> {
    return await this.couponService.isCouponCodeUnique(couponCode);
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
