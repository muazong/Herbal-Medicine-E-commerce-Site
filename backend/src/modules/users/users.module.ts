import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { MediaModule } from '../media/media.module';
import { UsersController } from './users.controller';
import { Cart } from '../carts/entities/cart.entity';
import { Media } from '../media/entities/media.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Media, Cart, Order]),
    forwardRef(() => MediaModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
