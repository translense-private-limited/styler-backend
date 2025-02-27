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
    return this.couponAdminService.createCouponForOutlet(createCouponDto);
  }

  @Get('coupons')
  async getCoupons(): Promise<CouponInterface[]> {
    return this.couponService.getAll();
  }

  @Get('outlet/:outletId/coupons')
  async getCouponsByOutletId(
    @Param('outletId') outletId: number,
  ): Promise<CouponInterface[]> {
    return this.couponAdminService.getCouponsForOutlet(outletId);
  }

  @Get('coupon/is-coupon-code-unique/:couponCode')
  async isCouponCodeUnique(
    @Param('couponCode') couponCode: string,
  ): Promise<CouponCheckResponseInterface> {
    return await this.couponService.isCouponCodeUnique(couponCode);
  }

  @Get('coupon/:couponId')
  async getCouponById(@Param('couponId') couponId: number): Promise<CouponInterface> {
    return this.couponService.findOne(couponId);
  }

  @Patch('coupon/:couponId')
  async updateCouponForGlobal(
    @Param('couponId') couponId: number,
    @Body() updateCouponDto: Partial<CreateCouponDto>,
  ): Promise<CouponInterface> {
    return this.couponService.update(couponId, updateCouponDto);
  }

  @Delete('coupon/:couponId')
  @HttpCode(204)
  async deleteCouponForGlobal(@Param('couponId') couponId: number): Promise<void> {
    return this.couponService.delete(couponId);
  }

  @Put('coupon/global/action')
  async acceptRejectGlobalCouponForOutlet(
    @Body() acceptRejectCouponCodeDto: AcceptRejectCouponCodeDto,
  ): Promise<boolean> {
    await this.couponAdminService.acceptRejectCouponForOutlet(
      acceptRejectCouponCodeDto,
    );
    return true;
  }

  @Get('outlet/:outletId/coupons/global/active')
  async getAllActiveCouponCodeForOutlet(
    @Param('outletId') outletId: number,
  ): Promise<CouponEntity[]> {
    return await this.couponAdminService.getAllActiveGlobalCouponForOutlet(outletId);
  }

  @Get('outlet/:outletId/coupons/global/pending')
  async getAllPendingGlobalCouponForOutlet(
    @Param('outletId') outletId: number,
  ): Promise<CouponEntity[]> {
    return await this.couponAdminService.getAllPendingGlobalCouponForOutlet(outletId);
  }

  @Patch('/outlet/:outletId/coupon/:couponId')
  async updateCouponForOutlet(
    @Param('couponId') couponId: number,
    @Param('outletId') outletId: number,
    @Body() updateCouponDto: Partial<CreateCouponDto>,
  ): Promise<CouponInterface> {
    return this.couponAdminService.updateCouponForOutlet(
      couponId,
      outletId,
      updateCouponDto,
    );
  }

  @Delete('outlet/:outletId/coupon/:couponId')
  @HttpCode(204)
  async deleteCouponForOutlet(
    @Param('couponId') couponId: number,
    @Param('outletId') outletId: number,
  ): Promise<void> {
    return this.couponAdminService.deleteCouponForOutlet(outletId, couponId);
  }

  @Get('coupon/outlet/:outletId/is-coupon-code-unique/:couponCode')
  async isCouponCodeUniqueForOutlet(
    @Param('couponCode') couponCode: string,
    @Param('outletId') outletId: number,
  ): Promise<CouponCheckResponseInterface> {
    return await this.couponAdminService.isCouponCodeUniqueForOutlet(couponCode, outletId);
  }

}
