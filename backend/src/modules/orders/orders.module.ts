import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { CartsModule } from '../carts/carts.module';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './orders.controller';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { OrderItemsModule } from '../order-items/order-items.module';
import { OrderItem } from '../order-items/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    CartsModule,
    CartItemsModule,
    OrderItemsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
