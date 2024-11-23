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

  async getNearbyOutlet({
    latitude,
    longitude,
    radius = 5,
  }: {
    latitude: number;
    longitude: number;
    radius?: number;
  }): Promise<OutletEntity[]> {
    return this.repository
      .createQueryBuilder('outlet')
      .addSelect(
        `(6371 * ACOS(
      COS(RADIANS(:latitude)) * COS(RADIANS(outlet.latitude))
      * COS(RADIANS(outlet.longitude) - RADIANS(:longitude))
      + SIN(RADIANS(:latitude)) * SIN(RADIANS(outlet.latitude))
    ))`,
        'distance',
      )
      .where('outlet.latitude IS NOT NULL AND outlet.longitude IS NOT NULL')
      .having('distance <= :radius', { radius })
      .orderBy('distance', 'ASC')
      .setParameters({ latitude, longitude })
      .getMany();
  }
}
