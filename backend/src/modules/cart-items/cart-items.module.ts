import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';

import { UsersModule } from '../users/users.module';
import { CartsModule } from '../carts/carts.module';
import { User } from '../users/entities/user.entity';
import { Cart } from '../carts/entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';
import { CartItemsController } from './cart-items.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, Product, Cart, User]),
    forwardRef(() => CartsModule),
    UsersModule,
    ProductsModule,
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService],
})
export class CartItemsModule {}
