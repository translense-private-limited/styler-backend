import { InjectRepository } from '@nestjs/typeorm';

import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { CouponOutletMappingEntity } from '../entities/coupon-outlet-mapping.entity';

export class CouponOutletMappingRepository extends BaseRepository<CouponOutletMappingEntity> {
  constructor(
    @InjectRepository(CouponOutletMappingEntity, getMysqlDataSource())
    protected readonly repository: Repository<CouponOutletMappingEntity>,
  ) {
    super(repository);
  }
}
