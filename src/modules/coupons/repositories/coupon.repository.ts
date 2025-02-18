import { InjectRepository } from '@nestjs/typeorm';

import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { CouponEntity } from '../entities/coupon.entity';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';

export class CouponRepository extends BaseRepository<CouponEntity> {
  constructor(
    @InjectRepository(CouponEntity, getMysqlDataSource())
    protected readonly repository: Repository<CouponEntity>,
  ) {
    super(repository);
  }

  async findUnmappedGlobalCouponsForOutlet(
    outletId: number,
  ): Promise<CouponEntity[]> {
    const coupons = await this.repository
      .createQueryBuilder('coupon')
      .leftJoin(
        'coupon_outlet_mapping',
        'mapping',
        'coupon.id = mapping.couponId AND mapping.outletId = :outletId',
        { outletId }, // Removed extra quote here
      )
      .where('coupon.owner = :owner', { owner: UserTypeEnum.ADMIN })
      .andWhere('mapping.id IS NULL') // Ensures the coupon is NOT mapped
      .getMany();

    return coupons;
  }
}
