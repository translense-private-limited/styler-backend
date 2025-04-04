import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEnum } from '@src/utils/enums/job.enum';
import { TimestampEntity } from '@modules/customer/review/entities/timestamp.entity';

@Injectable()
export class SeedTimestampData {
  constructor(
    @InjectRepository(TimestampEntity)
    private readonly timestampRepository: Repository<TimestampEntity>,
  ) {}

  async seedTimestamps(): Promise<void> {
    const queryRunner = this.timestampRepository.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
      await queryRunner.query('TRUNCATE TABLE review_timestamp;');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

      const timestamps = [
        {
          jobName: JobEnum.REVIEW_AGGREGATION_JOB,
          lastSyncTime: new Date('1970-01-01T00:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await this.timestampRepository.save(timestamps);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
