import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import {
  UserMediaService,
  ProductMediaService,
  CategoryMediaService,
} from './services';
import { Media } from './entities/media.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ProductMediaController, UserMediaController } from './controllers';
import { CategoryMediaController } from './controllers/category-media.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, User, Product, Category]),
    forwardRef(() => UsersModule),
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [
    UserMediaController,
    ProductMediaController,
    CategoryMediaController,
  ],
  providers: [UserMediaService, ProductMediaService, CategoryMediaService],
  exports: [UserMediaService, ProductMediaService, CategoryMediaService],
})
export class MediaModule {}
