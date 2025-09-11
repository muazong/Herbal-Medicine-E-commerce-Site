import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserProvider } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { MediaService } from '../media/media.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { DefaultImagesName, InitialUserMedia } from '../../common/contances';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly mediaService: MediaService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
  async validateGoogleUser(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    image: string,
  ) {
    const user = await this.userRepo.findOneBy({ email });
    if (user) return user;

    const avatar = await this.mediaService.createUserMedia({
      ...InitialUserMedia['avatar'],
      path: image,
      mimetype: 'jpg',
      filename: DefaultImagesName.GOOGLE_AVATAR,
    });

    const cover = await this.mediaService.createUserMedia(
      InitialUserMedia['cover'],
    );

    const newUser = this.userRepo.create({
      avatar,
      cover,
      username: id,
      email,
      firstName,
      lastName,
      provider: UserProvider.GOOGLE,
    });

    return await this.userRepo.save(newUser);
  }
  async validateGithubUser(
    id: string,
    email: string,
    name: string,
    image: string,
  ) {
    const user = await this.userRepo.findOneBy({ email });
    if (user) return user;

    const avatar = await this.mediaService.createUserMedia({
      ...InitialUserMedia['avatar'],
      path: image,
      mimetype: 'jpg',
      filename: DefaultImagesName.GITHUB_AVATAR,
    });

    const cover = await this.mediaService.createUserMedia(
      InitialUserMedia['cover'],
    );

    const newUser = this.userRepo.create({
      avatar,
      cover,
      email,
      username: id,
      firstName: name,
      lastName: '',
      provider: UserProvider.GITHUB,
    });

    return await this.userRepo.save(newUser);
  }
  async login(user: User, res: Response) {
    const accessTokenPayload = {
      sub: user.id,
      fullName: user.fullName,
      role: user.role,
      type: 'access',
    };
    const refreshTokenPayload = { sub: user.id, type: 'refresh' };

    const token = {
      accessToken: this.jwtService.sign(accessTokenPayload, {
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d',
      }),
    };

    res.cookie(
      this.configService.getOrThrow('ENVIRONMENT') === 'PROD'
        ? '__Host-refresh'
        : 'refresh',
      token.refreshToken,
      {
        httpOnly: true,
        secure: this.configService.getOrThrow('ENVIRONMENT') === 'PROD',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    );

    return {
      accessToken: token.accessToken,
    };
  }
  async refreshAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.jwtService.sign(
        {
          fullName: user.fullName,
          sub: payload.sub,
          role: user.role,
          type: 'access',
        },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  async getUserInfo(user: { id: string }) {
    const { password, ...result } = await this.userService.findOne(user.id);
    return result;
  }
  logout(res: Response) {
    const refreshTokenName =
      this.configService.get('ENVIRONMENT') === 'PROD'
        ? '__Host-refresh'
        : 'refresh';

    res.clearCookie(refreshTokenName, {
      httpOnly: true,
      secure: this.configService.get('ENVIRONMENT') === 'PROD',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      expires: new Date(0),
    });

    return { message: 'Logged out successfully' };
  }
}
