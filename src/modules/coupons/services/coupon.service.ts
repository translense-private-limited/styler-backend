import { Injectable, NotFoundException } from '@nestjs/common';

import { CouponInterface } from '../interfaces/coupon.interface';

import { CouponRepository } from '../repositories/coupon.repository';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';

@Injectable()
export class CouponService {
  constructor(
    private couponRepository: CouponRepository,
    private clientExternalService: ClientExternalService,
  ) {}

  async getCouponByIdOrThrow(id: number): Promise<CouponInterface> {
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

  // Create a new coupon
  async create(createCouponDto: CreateCouponDto): Promise<CouponInterface> {
    // if (createCouponDto.clientId) {
    //   const client = await this.clientExternalService.getClientById(
    //     createCouponDto.clientId,
    //   );
    //   // createCouponDto.client  = client
    // }
    const coupon = this.couponRepository
      .getRepository()
      .create(createCouponDto);
    return await this.couponRepository.getRepository().save(coupon);
  }

  // Find all coupons
  async findAll(): Promise<CouponInterface[]> {
    return await this.couponRepository.getRepository().find();
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

  async isCouponCodeUnique(couponCode: string): Promise<boolean> {
    const coupon = await this.couponRepository.getRepository().findOne({
      where: {
        code: couponCode,
      },
    });

    if (!coupon) {
      return true;
    }
    return false;
  }
}
