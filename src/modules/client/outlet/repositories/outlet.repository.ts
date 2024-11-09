import { InjectRepository } from '@nestjs/typeorm';
import { OutletEntity } from '../entities/outlet.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';

export class OutletRepository extends BaseRepository<OutletEntity> {
  constructor(
    @InjectRepository(OutletEntity, getMysqlDataSource())
    protected repository: Repository<OutletEntity>,
  ) {
    super(repository);
  }
}
