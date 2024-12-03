import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/orders.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { OrderItemEntity } from './entities/order-item.entity';
import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OutletModule } from '@modules/client/outlet/outlet.module';
import { OrderRepositoy } from './repositories/order.repository';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderItemService } from './services/order-item.service';
import { ServiceModule } from '@modules/client/services/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [OrderEntity, OrderItemEntity],
      getMysqlDataSource(),
    ),
    OutletModule,
    ServiceModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepositoy,
    OrderItemRepository,
    OrderItemService,
  ],
  exports: [],
})
export class OrderModule {}
