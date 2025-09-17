import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  JwtStrategy,
  LocalStrategy,
  GoogleStrategy,
  GithubStrategy,
} from './strategies';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MediaModule } from '../media/media.module';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { Media } from '../media/entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Media]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
          signOptions: {
            issuer: configService.getOrThrow('ISSUER'),
            audience: configService.getOrThrow('AUDIENCE'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    MediaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    GithubStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
