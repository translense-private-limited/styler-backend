import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/orders.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { OrderItemEntity } from './entities/order-item.entity';
import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OutletModule } from '@modules/client/outlet/outlet.module';
import { OrderRepository } from './repositories/order.repository';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderItemService } from './services/order-item.service';
import { ServiceModule } from '@modules/client/services/service.module';
import { AppointmentRepository } from './repositories/appointment.repository';
import { AppointmentService } from './services/appointment.service';
import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentController } from './controllers/appoitment.controller';
import { ClientOrderController } from './controllers/client-order.controller';
import { ClientOrderService } from './services/client-order.service';
import { CustomerModule } from '../customer.module';
import { ClientModule } from '@modules/client/client/client.module';
import { OrderFulfillmentOtpService } from './services/order-fulfillment-otp.service';
import { OrderFulfillmentOtpEntity } from './entities/otp.entity';
import { OrderFulfillmentOtpRepository } from './repositories/otp.repository';
import { CLientAppointmentController } from './controllers/client-appointment.controller';
import { OrderExternalService } from './services/order-external.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        OrderEntity,
        OrderItemEntity,
        AppointmentEntity,
        OrderFulfillmentOtpEntity,
      ],
      getMysqlDataSource(),
    ),
    OutletModule,
    ServiceModule,
    forwardRef(() => CustomerModule),
    ClientModule,
  ],
  controllers: [
    OrderController,
    AppointmentController,
    ClientOrderController,
    CLientAppointmentController,
  ],
  providers: [
    OrderService,
    OrderRepository,
    OrderItemRepository,
    OrderItemService,
    AppointmentRepository,
    AppointmentService,
    ClientOrderService,
    OrderFulfillmentOtpService,
    OrderFulfillmentOtpRepository,
    OrderExternalService,
  ],
  exports: [OrderExternalService],
})
export class OrderModule {}
