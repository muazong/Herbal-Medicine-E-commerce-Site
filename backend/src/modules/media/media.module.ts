import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { User } from '../users/entities/user.entity';
import { MediaController } from './media.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, User]),
    forwardRef(() => UsersModule),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
