import { Injectable, NotFoundException } from '@nestjs/common';

import { CouponInterface } from '../interfaces/coupon.interface';

import { CouponRepository } from '../repositories/coupon.repository';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';
import { CouponCheckResponseInterface } from '../interfaces/coupon-check-response.interface';
import { CouponEntity } from '../entities/coupon.entity';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';

@Injectable()
export class CouponService {
  constructor(
    private couponRepository: CouponRepository,
    private clientExternalService: ClientExternalService,
  ) {}

  async save(coupon: CouponEntity): Promise<CouponEntity> {
    return await this.couponRepository.getRepository().save(coupon);
  }

  async getCouponByIdOrThrow(id: number): Promise<CouponEntity> {
    const coupon = await this.couponRepository.getRepository().findOne({
      where: {
        id,
      },
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon not found `);
    }
    return coupon;
  }

  async getCouponByCouponCode(
    couponCode: string,
  ): Promise<CouponEntity | null> {
    const coupon = await this.couponRepository.getRepository().findOne({
      where: {
        code: couponCode,
      },
    });

    return coupon;
  }

  // Create a new coupon
  async create(
    createCouponDto: CreateCouponDto & {
      owner: UserTypeEnum.ADMIN | UserTypeEnum.CLIENT;
    },
  ): Promise<CouponEntity> {
    const coupon = this.couponRepository
      .getRepository()
      .create(createCouponDto);
    return await this.couponRepository.getRepository().save(coupon);
  }

  // Find all coupons
  async getAll(): Promise<CouponEntity[]> {
    return await this.couponRepository.getRepository().find();
  }

  async findUnmappedGlobalCouponsForOutlet(
    outletId: number,
  ): Promise<CouponEntity[]> {
    return await this.couponRepository.findUnmappedGlobalCouponsForOutlet(
      outletId,
    );
  }

  async getAllGlobalCoupons(): Promise<CouponEntity[]> {
    return this.couponRepository.getRepository().find({
      where: {
        owner: UserTypeEnum.ADMIN,
      },
    });
  }

  // Find a coupon by its ID
  async findOne(id: number): Promise<CouponInterface> {
    const coupon = await this.getCouponByIdOrThrow(id);

    return coupon;
  }

  // Update a coupon
  async update(
    id: number,
    updateCouponDto: Partial<CreateCouponDto>,
  ): Promise<CouponInterface> {
    const coupon = await this.getCouponByIdOrThrow(id);
    const updatedCoupon = Object.assign(coupon, updateCouponDto);

    return this.couponRepository.getRepository().save(updatedCoupon);
  }

  // Delete a coupon by its ID
  async delete(id: number): Promise<void> {
    await this.getCouponByIdOrThrow(id);
    await this.couponRepository.getRepository().delete({ id });
  }

  async isCouponCodeUnique(
    couponCode: string,
  ): Promise<CouponCheckResponseInterface> {
    const coupon = await this.couponRepository.getRepository().findOne({
      where: {
        code: couponCode,
      },
    });

    if (coupon) {
      return {
        success: false,
        message:
          'The coupon code is already present with the provided code. Please choose a unique code.',
        isUnique: false,
        coupon: couponCode,
      };
    }
    return {
      success: true,
      message: 'Coupon code is unique.',
      isUnique: true,
      coupon: couponCode,
    };
  }
}
