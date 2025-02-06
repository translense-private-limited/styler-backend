import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponEntity } from './entities/coupon.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { CouponService } from './services/coupon.service';
import { CouponRepository } from './repositories/coupon.repository';
import { CouponAdminController } from './controllers/coupon-admin.controller';
import { ClientModule } from '@modules/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CouponEntity], getMysqlDataSource()),
    ClientModule,
  ],
  providers: [CouponService, CouponRepository],
  controllers: [CouponAdminController],
  exports: [],
})
export class CouponModule {}
