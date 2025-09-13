import { join } from 'path';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { CartsModule } from '../carts/carts.module';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { CartItemsModule } from '../cart-items/cart-items.module';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(process.cwd(), 'public'),
        serveRoot: '/',
      },
      {
        rootPath: join(process.cwd(), 'uploads/users'),
        serveRoot: '/users',
      },
      {
        rootPath: join(process.cwd(), 'uploads/products'),
        serveRoot: '/products',
      },
    ),
    ConfigModule.forRoot({ isGlobal: true }),

    DatabaseModule,
    UsersModule,
    AuthModule,
    CartsModule,
    CartItemsModule,
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
