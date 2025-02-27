import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  Patch,
  Put,
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
import { AcceptRejectCouponCodeDto } from '../dtos/accept-reject-coupon-code.dto';

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

  @Post('outlet/:outletId/coupon')
  async createCouponForOutlet(
    @Param('outletId') outletId: number,
    @Body() createCouponDto: CreateCouponClientDto,
  ): Promise<CouponOutletMappingEntity> {
    return this.couponClientService.createCoupon(createCouponDto);
  }

  @Get('coupons')
  async getCoupons(): Promise<CouponInterface[]> {
    return this.couponService.getAll();
  }

  @Get('outlet/:outletId/coupons')
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

  @Patch('coupon/:id/update')
  async updateCouponForGlobal(
    @Param('id') id: number,
    @Body() updateCouponDto: Partial<CreateCouponDto>,
  ): Promise<CouponInterface> {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete('coupon/:id/delete')
  @HttpCode(204)
  async deleteCouponForGlobal(@Param('id') id: number): Promise<void> {
    return this.couponService.delete(id);
  }

  // API's for CouponsForOutlet

  @Get('coupons/global')
  async getGlobalCouponsForOutlet(): Promise<CouponEntity[]> {
    return await this.couponClientService.getAllCouponCodePublishedByAdmin();
  }

  @Put('coupon/global/action')
  async acceptRejectCouponCodeForGlobal(
    @Body() acceptRejectCouponCodeDto: AcceptRejectCouponCodeDto,
  ): Promise<boolean> {
    await this.couponClientService.acceptRejectCouponCode(
      acceptRejectCouponCodeDto,
    );
    return true;
  }

  @Get('outlet/:outletId/coupons/global/active')
  async getAllActiveCouponCodeForOutlet(
    @Param('outletId') outletId: number,
  ): Promise<CouponEntity[]> {
    return await this.couponClientService.getAllActiveGlobalCoupon(outletId);
  }
  @Get('outlet/:outletId/coupons/global/pending')
  async getAllPendingGlobalCouponForOutlet(
    @Param('outletId') outletId: number,
  ): Promise<CouponEntity[]> {
    return await this.couponClientService.getAllPendingGlobalCoupon(outletId);
  }

  @Patch('/outlet/:outletId/coupon/:couponId/update')
  async updateCouponForOutlet(
    @Param('couponId') couponId: number,
    @Param('outletId') outletId: number,
    @Body() updateCouponDto: Partial<CreateCouponDto>,
  ): Promise<CouponInterface> {
    return this.couponClientService.updateCoupon(
      couponId,
      outletId,
      updateCouponDto,
    );
  }

  @Delete('outlet/:outletId/coupon/:couponId/delete')
  @HttpCode(204)
  async deleteCouponForOutlet(
    @Param('couponId') couponId: number,
    @Param('outletId') outletId: number,
  ): Promise<void> {
    return this.couponClientService.delete(outletId, couponId);
  }

  @Get('coupon/outlet/:outletId/is-coupon-code-unique/:couponCode')
  async isCouponCodeUniqueForOutlet(
    @Param('couponCode') couponCode: string,
    @Param('outletId') outletId: number,
  ): Promise<CouponCheckResponseInterface> {
    const response =
      await this.couponClientService.doesCouponCodeExistForOutlet(
        couponCode,
        outletId,
      );

    if (!response) {
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
}
