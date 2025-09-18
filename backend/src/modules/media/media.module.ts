import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { MediaController } from './media.controller';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, User, Product, Category]),
    forwardRef(() => UsersModule),
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
