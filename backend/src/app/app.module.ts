import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';

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
  providers: [],
})
export class AppModule {}
