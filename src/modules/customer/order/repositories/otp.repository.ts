import { BaseRepository } from '@src/utils/repositories/base-repository';
import { getMysqlDataSource } from '@modules/database/data-source';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderFulfillmentOtpEntity } from '../entities/otp.entity';

export class OrderFulfillmentOtpRepository extends BaseRepository<OrderFulfillmentOtpEntity> {
  constructor(
    @InjectRepository(OrderFulfillmentOtpEntity, getMysqlDataSource())
    protected repository: Repository<OrderFulfillmentOtpEntity>,
  ) {
    super(repository);
  }
}
