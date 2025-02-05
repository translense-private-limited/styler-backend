import { InjectRepository } from '@nestjs/typeorm';

import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { CouponEntity } from '../entities/coupon.entity';

export class CouponRepository extends BaseRepository<CouponEntity> {
  constructor(
    @InjectRepository(CouponEntity, getMysqlDataSource())
    protected readonly repository: Repository<CouponEntity>,
  ) {
    super(repository);
  }
}
