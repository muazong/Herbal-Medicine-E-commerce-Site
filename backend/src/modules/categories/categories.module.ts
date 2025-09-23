import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

import { MediaModule } from '../media/media.module';
import { Category } from './entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product]),
    forwardRef(() => ProductsModule),
    forwardRef(() => MediaModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
