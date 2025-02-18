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
  Query,
} from '@nestjs/common';
import { CouponService } from '../services/coupon.service';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { CouponInterface } from '../interfaces/coupon.interface';
import { ApiTags } from '@nestjs/swagger';
import { CouponCheckResponseInterface } from '../interfaces/coupon-check-response.interface';
import { CouponAdminService } from '../services/coupon-admin.service';

import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';

import { CreateCouponClientDto } from '../dtos/create-coupon-client.dto';
import { CouponClientService } from '../services/coupon-client.service';
import { CouponEntity } from '../entities/coupon.entity';
import { AcceptRejectCouponCodeDto } from '../dtos/accept-reject-coupon-code.dto';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { CouponStatusEnum } from '../enums/coupon-status.enum';

@Controller('client')
@ApiTags('Coupons')
export class CouponClientController {
  constructor(
    private couponService: CouponService,
    private couponAdminService: CouponAdminService,
    private couponClientService: CouponClientService,
  ) {}

  // *********************** Global Coupon Routes ******************************** //

  @Get('coupons/global')
  async getGlobalCoupons(): Promise<CouponEntity[]> {
    return await this.couponClientService.getAllCouponCodePublishedByAdmin();
  }

  /**
   * Handles HTTP PUT requests to accept or reject a global coupon code.
   *
   * @param acceptRejectCouponCodeDto - Data Transfer Object containing the details
   *                                    required to accept or reject a coupon code.
   * @description used to accept or reject global coupon
   */
  @Put('coupon/global/action')
  async acceptRejectCouponCode(
    @Body() acceptRejectCouponCodeDto: AcceptRejectCouponCodeDto,
  ): Promise<boolean> {
    await this.couponClientService.acceptRejectCouponCode(
      acceptRejectCouponCodeDto,
    );
    return true;
  }

  @Get('coupons/global/outlet/:outletId/active')
  async getAllActiveCouponCode(
    @Param('outletId') outletId: number,
  ): Promise<CouponEntity[]> {
    return await this.couponClientService.getAllActiveGlobalCoupon(outletId);
  }

  @Get('coupons/global/outlet/:outletId/pending')
  async getAllPendingGlobalCoupon(
    @Param('outletId') outletId: number,
  ): Promise<CouponEntity[]> {
    return await this.couponClientService.getAllActiveGlobalCoupon(outletId);
  }

  //-----------------  need to check --------------//
  @Get('coupon/:id')
  async getCouponById(@Param('id') id: number): Promise<CouponInterface> {
    return this.couponService.findOne(id);
  }

  // ********************** Client Coupon Routes ******************************* //
  @Post('coupon')
  async createCoupon(
    @Body() createCouponDto: CreateCouponClientDto,
  ): Promise<CouponOutletMappingEntity> {
    return this.couponClientService.createCoupon(createCouponDto);
  }

  @Patch('/outlet/:outletId/coupon/:couponId')
  async updateCoupon(
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

  @Delete('outlet/:outletId/coupon/:couponId')
  @HttpCode(204)
  async deleteCoupon(
    @Param('couponId') couponId: number,
    @Param('outletId') outletId: number,
  ): Promise<void> {
    return this.couponClientService.delete(outletId, couponId);
  }

  @Get('outlet/:outletId/coupons')
  async getClientCoupons(
    @Param('outletId') outletId: number,
    @Query('status') status?: CouponStatusEnum, // Optional query param
  ): Promise<CouponEntity[]> {
    return this.couponClientService.getCoupons(outletId, status);
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
}
