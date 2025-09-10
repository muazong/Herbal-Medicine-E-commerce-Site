import { join } from 'path';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { DatabaseModule } from '../modules/database/database.module';
import { UsersModule } from '../modules/users/users.module';
import { AuthModule } from '../modules/auth/auth.module';

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
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
