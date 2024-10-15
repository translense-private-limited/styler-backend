import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';


@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity, getMysqlDataSource())
    private repository: Repository<RoleEntity>,
  ) {
    super(repository);
  }
}
