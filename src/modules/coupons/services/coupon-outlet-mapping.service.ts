import { Injectable } from '@nestjs/common';
import { CouponOutletMappingRepository } from '../repositories/coupon-outlet-mapping.repository';
import { OutletEntity } from '@modules/client/outlet/entities/outlet.entity';
import { CouponEntity } from '../entities/coupon.entity';
import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';
import { UpdateResult } from 'typeorm';
import { CouponStatusEnum } from '../enums/coupon-status.enum';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';

@Injectable()
export class CouponOutletMappingService {
  constructor(
    private couponOutletMappingRepository: CouponOutletMappingRepository,
  ) { }

  async createCouponOutletMapping(
    outlet: OutletEntity,
    coupon: CouponEntity,
  ): Promise<CouponOutletMappingEntity> {
    return await this.couponOutletMappingRepository
      .getRepository()
      .save({ outlet, coupon });
  }

  async save(
    outletMappingEntity: CouponOutletMappingEntity,
  ): Promise<CouponOutletMappingEntity> {
    return await this.couponOutletMappingRepository
      .getRepository()
      .save(outletMappingEntity);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    return await this.couponOutletMappingRepository
      .getRepository()
      .softDelete({ id });
  }

  async getByCouponAndOutletId(
    outletId: number,
    couponId: number,
  ): Promise<CouponOutletMappingEntity> {
    const couponOutletMapping = await this.couponOutletMappingRepository
      .getRepository()
      .findOne({
        where: {
          coupon: { id: couponId },
          outlet: { id: outletId },
        },
        relations: ['coupon', 'outlet'],

      });
    return couponOutletMapping;
  }

  // async addOrUpdateMapping(
  //   outlet: OutletEntity,
  //   coupon: CouponEntity,
  // ): Promise<void> {
  //   await this.couponOutletMappingRepository.getRepository().upsert(
  //     { outlet, coupon },
  //     {
  //       conflictPaths: ['outlet', 'coupon'], // Columns that determine uniqueness
  //       upsertType: 'on-conflict-do-update', // Ensures it updates on conflict
  //     },
  //   );
  // }

  async getAllActiveCouponsByOutletId(
    outletId: number,
  ): Promise<CouponEntity[]> {
    const couponOutletMappings = await this.couponOutletMappingRepository
      .getRepository()
      .find({
        where: {
          outlet: { id: outletId },
          coupon: {
            status: CouponStatusEnum.ACCEPTED, isActive: true, owner: UserTypeEnum.ADMIN,
          },
        },
        relations: ['coupon', 'outlet'],
      });

    return couponOutletMappings.map((mapping) => mapping.coupon);
  }

  async getAllCustomerCouponsByOutletId(
    outletId: number,
  ): Promise<CouponEntity[]> {
    const couponOutletMappings = await this.couponOutletMappingRepository
      .getRepository()
      .find({
        where: {
          outlet: { id: outletId },
          coupon: {
            status: CouponStatusEnum.ACCEPTED, isActive: true,
          },
        },
        relations: ['coupon', 'outlet'],
      });

    return couponOutletMappings.map((mapping) => mapping.coupon);
  }

  async getAllCouponsByOutletId(
    outletId: number,
    status: CouponStatusEnum
  ): Promise<CouponEntity[]> {
    const couponOutletMappings = await this.couponOutletMappingRepository
      .getRepository()
      .find({
        where: {
          outlet: { id: outletId },
          coupon: { owner: UserTypeEnum.CLIENT },
        },
        relations: ['coupon'],
      });

    return couponOutletMappings
      .map((mapping) => mapping.coupon)
      .filter((coupon) => {
        if (status === CouponStatusEnum.ACCEPTED) return coupon.isActive === true;
        if (status === CouponStatusEnum.REJECTED) return coupon.isActive === false;
        return true;
      });
  }
}
