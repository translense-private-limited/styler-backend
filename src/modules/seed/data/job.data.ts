import { AggregatedRatingRepository } from '@modules/customer/review/repositories/aggregate-rating.repository';
import { TimestampRepository } from '@modules/customer/review/repositories/timestamp.repository';
import { Injectable } from '@nestjs/common';
import { JobEnum } from '@src/utils/enums/job.enum';

@Injectable()
export class SeedJobData {
  constructor(
    private readonly timestampRepository: TimestampRepository,
    private readonly aggregatedRatingRepository: AggregatedRatingRepository,
  ) {}

  async seedJobData(): Promise<void> {
    const queryRunner = this.timestampRepository
      .getRepository()
      .manager.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
      await queryRunner.query('TRUNCATE TABLE address;');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

      const addresses = [
        {
          id: 1,
          jobName: JobEnum.REVIEW_AGGREGATION_JOB,
          lastSyncTime: '1970-04-04 11:22:00.90',
        },
      ];

      await this.timestampRepository.getRepository().save(addresses);

      const tableName =
        this.aggregatedRatingRepository.getRepository().metadata.tableName;
      await this.aggregatedRatingRepository
        .getRepository()
        .manager.query(`TRUNCATE TABLE ${tableName};`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
