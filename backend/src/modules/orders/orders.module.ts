import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './orders.controller';
import { OrderItemsModule } from '../order-items/order-items.module';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    CartsModule,
    OrderItemsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
