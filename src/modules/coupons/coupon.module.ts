import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponEntity } from './entities/coupon.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { CouponService } from './services/coupon.service';
import { CouponRepository } from './repositories/coupon.repository';
import { CouponAdminController } from './controllers/coupon-admin.controller';

import { CouponOutletMappingEntity } from './entities/coupon-outlet-mapping.entity';
import { CouponAdminService } from './services/coupon-admin.service';
import { CouponOutletMappingRepository } from './repositories/coupon-outlet-mapping.repository';
import { OutletModule } from '@modules/client/outlet/outlet.module';
import { ClientModule } from '@modules/client/client.module';
import { CouponOutletMappingService } from './services/coupon-outlet-mapping.service';
import { CouponClientController } from './controllers/coupon-client.controller';
import { CouponClientService } from './services/coupon-client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [CouponEntity, CouponOutletMappingEntity],
      getMysqlDataSource(),
    ),
    OutletModule,
    ClientModule,
  ],
  providers: [
    CouponService,
    CouponRepository,
    CouponAdminService,
    CouponOutletMappingService,
    CouponOutletMappingRepository,
    CouponClientService,
  ],
  controllers: [CouponAdminController, CouponClientController],
  exports: [],
})
export class CouponModule {}
