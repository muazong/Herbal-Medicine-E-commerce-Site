import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { Media } from './entities/media.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ProductMediaService, UserMediaService } from './services';
import { ProductMediaController, UserMediaController } from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, User, Product, Category]),
    forwardRef(() => UsersModule),
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [UserMediaController, ProductMediaController],
  providers: [UserMediaService, ProductMediaService],
  exports: [UserMediaService, ProductMediaService],
})
export class MediaModule {}
