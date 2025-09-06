import * as fs from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { userMedia } from '../common/enums';
import { Media } from './entities/media.entity';
import { DefaultImages } from '../common/contances';
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

  // TODO: Add Product media api

  async findUserMedia(userId: string, type: userMedia) {
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

  async findUserImages(userId: string) {
    const user = await this.userService.findOne(userId);
    return { avatar: user.avatar, cover: user.cover };
  }

  async uploadUserMedia(
    userId: string,
    file: Express.Multer.File,
    type: userMedia,
  ) {
    try {
      const user = await this.userService.findOne(userId);
      const media = user[type] ?? (await this.findUserMedia(userId, type));

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

  async updateUserMedia(
    userId: string,
    file: Express.Multer.File,
    type: userMedia,
  ) {
    try {
      const media = await this.findUserMedia(userId, type);

      media.filename = file.filename;
      media.mimetype = file.mimetype;
      media.path = file.path.replace(/^.*users/, '/users');
      media.size = file.size;
      media.type = type;

      await this.mediaRepo.save(media);

      return { message: `Updated user's ${type} successfully` };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update ${type}`, err.stack);
      throw err;
    }
  }

  async removeUserMedia(userId: string, type: userMedia) {
    try {
      const user = await this.userService.findOne(userId);
      const media = user[type] ?? (await this.findUserMedia(userId, type));

      // Delete avatar or cover image in user's folder
      const filePath = join(process.cwd(), 'uploads', media.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(
          `Deleted ${type} file for user ${user.id}: ${filePath}`,
        );
      } else {
        this.logger.log(
          `${type} file not found for user ${user.id}, skip delete`,
        );
      }

      media.path =
        type === userMedia.AVATAR ? DefaultImages.AVATAR : DefaultImages.COVER;
      media.filename = `default_${type}`;
      media.mimetype = 'svg';
      media.size = 0;

      await this.mediaRepo.save(media);

      user[type] = media;
      await this.userRepo.save(user);

      // Delete the user's folder if no file exists
      const userFolder = join(process.cwd(), 'uploads', 'users', user.id);
      if (fs.existsSync(userFolder)) {
        const files = fs.readdirSync(userFolder);
        if (files.length === 0) {
          fs.rmdirSync(userFolder);
          this.logger.log(
            `Deleted empty folder for user ${user.id}: ${userFolder}`,
          );
        }
      }

      return { message: `User ${type} deleted` };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete user ${type}`, err.stack);
      throw err;
    }
  }
}
