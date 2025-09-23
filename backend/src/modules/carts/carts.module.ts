import { CartsService } from './carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { Cart } from './entities/cart.entity';
import { UsersModule } from '../users/users.module';
import { CartsController } from './carts.controller';
import { ProductsModule } from '../products/products.module';
import { CartItemsModule } from '../cart-items/cart-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    UsersModule,
    ProductsModule,
    forwardRef(() => CartItemsModule),
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
