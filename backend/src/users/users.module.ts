import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { User } from './entities/user.entity';
import { Media } from '../media/entities/media.entity';
import { UsersService } from './users.service';
import { MediaModule } from '../media/media.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Media]),
    forwardRef(() => MediaModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
