import { InjectRepository } from '@nestjs/typeorm';

import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { CustomerEntity } from '../entities/customer.entity';

export class CustomerRepository extends BaseRepository<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity, getMysqlDataSource())
    protected repository: Repository<CustomerEntity>,
  ) {
    super(repository);
  }
}
