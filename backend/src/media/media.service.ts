import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Media } from './entities/media.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly userService: UsersService,
  ) {}

  private async findUserMedia(userId: string, type: 'avatar' | 'cover') {
    try {
      const user = await this.userService.findOne(userId);

      const media = user[type];
      if (!media) {
        throw new NotFoundException(`User's ${type} not found`);
      }

      return media;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to fetch user ${type}`, err.stack);
      throw err;
    }
  }
  private async saveUserMedia(
    userId: string,
    media: Media,
    file: Express.Multer.File,
    type: 'avatar' | 'cover',
  ) {
    try {
      const user = await this.userService.findOne(userId);
      if (!media) throw new NotFoundException(`User's ${type} not found`);

      media.path = file.path.replace(/^.*users/, '/users');
      media.filename = file.filename;
      media.mimetype = file.mimetype;
      media.size = file.size;
      await this.mediaRepo.save(media);

      user[type] = media;
      await this.userRepo.save(user);

      return {
        message: `${type} uploaded`,
        path: media.path,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to upload user ${type}`, err.stack);
      throw err;
    }
  }
  private async updateUserMedia(
    media: Media,
    file: Express.Multer.File,
    type: 'avatar' | 'cover',
  ) {
    try {
      if (!media) throw new NotFoundException(`User's ${type} not found`);

      media.filename = file.filename;
      media.mimetype = file.mimetype;
      media.path = file.path.replace(/^.*users/, '/users');
      media.size = file.size;

      await this.mediaRepo.save(media);

      return { message: `Updated user's ${type} successfully` };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update ${type}`, err.stack);
      throw err;
    }
  }

  async findUserAvatar(userId: string) {
    return await this.findUserMedia(userId, 'avatar');
  }
  async findUserCover(userId: string) {
    return await this.findUserMedia(userId, 'cover');
  }
  async findUserImages(userId: string) {
    const user = await this.userService.findOne(userId);
    return { avatar: user.avatar, cover: user.cover };
  }

  async uploadUserAvatar(userId: string, file: Express.Multer.File) {
    const avatar = await this.findUserAvatar(userId);
    return await this.saveUserMedia(userId, avatar, file, 'avatar');
  }
  async uploadUserCover(userId: string, file: Express.Multer.File) {
    const cover = await this.findUserCover(userId);
    return await this.saveUserMedia(userId, cover, file, 'cover');
  }

  async updateUserAvatar(userId: string, file: Express.Multer.File) {
    const avatar = await this.findUserAvatar(userId);
    return await this.updateUserMedia(avatar, file, 'avatar');
  }
  async updateUserCover(userId: string, file: Express.Multer.File) {
    const cover = await this.findUserCover(userId);
    return await this.updateUserMedia(cover, file, 'cover');
  }

  async removeUserAvatar(userId: string, avatarId: string) {}
}
