import {
  Logger,
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { Media } from '../entities/media.entity';
import { MediaType } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { CreateMediaDto } from '../dtos/create-media.dto';

@Injectable()
export class UserMediaService {
  private readonly logger = new Logger(UserMediaService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  /**
   * Finds a media file for a user.
   * @param userId - The ID of the user to find the media for.
   * @param type - The type of media to find.
   * @returns Promise<Media> - The found media file.
   * @throws BadRequestException if the user ID is invalid.
   * @throws NotFoundException if the user is not found.
   * @throws Error if any other error occurs.
   */
  async findMedia(userId: string, type: MediaType) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: [type],
      });

      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const media: Media | null = user[type];

      return media;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to fetch user ${type}`, err.stack);
      throw err;
    }
  }

  /**
   * Finds the user's avatar and cover images.
   * @param userId - The ID of the user to find the images for.
   * @returns Promise<{ userId: string, avatar: Media, cover: Media }> - The found user's avatar and cover images.
   * @throws BadRequestException if the user ID is invalid.
   * @throws NotFoundException if the user is not found.
   * @throws Error if any other error occurs.
   */
  async findImages(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['avatar', 'cover'],
      });

      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      return { userId, avatar: user.avatar, cover: user.cover };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to fetch user images`, err.stack);
      throw err;
    }
  }

  /**
   * Creates a new media file.
   * @param createMediaDto - The media data to create.
   * @returns Promise<Media> - The created media file.
   * @throws Error if any other error occurs.
   */
  async createMedia(createMediaDto: CreateMediaDto) {
    try {
      const newMedia = this.mediaRepo.create(createMediaDto);
      return await this.mediaRepo.save(newMedia);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create user's media image`, err.stack);
      throw err;
    }
  }

  /**
   * Uploads a media file for a user.
   * @param userId - The ID of the user to upload the media for.
   * @param file - The media file to upload.
   * @param type - The type of media to upload.
   * @returns Promise<Media> - The uploaded media file.
   * @throws BadRequestException if the user ID is invalid.
   * @throws NotFoundException if the user is not found.
   * @throws Error if any other error occurs.
   */
  async uploadMedia(
    userId: string,
    file: Express.Multer.File,
    type: MediaType,
  ) {
    try {
      let media = await this.findMedia(userId, type);

      if (!media) {
        media = await this.createMedia({
          path: file.path.replace(/^.*users/, '/users'),
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size,
          type: type,
        });
      } else {
        media = await this.updateMedia(media, file, type);
      }

      const user = await this.userService.findOne(userId);
      user[type] = media;
      await this.userRepo.save(user);

      return media;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to upload user ${type}`, err.stack);
      throw err;
    }
  }

  /**
   * Updates a media file for a user.
   * @param media - The media file to update.
   * @param file - The updated media file.
   * @param type - The type of media to update.
   * @returns Promise<Media> - The updated media file.
   * @throws Error if any other error occurs.
   */
  async updateMedia(media: Media, file: Express.Multer.File, type: MediaType) {
    try {
      media.path = file.path.replace(/^.*users/, '/users');
      media.mimetype = file.mimetype;
      media.filename = file.filename;
      media.size = file.size;
      media.type = type;

      return media;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update ${type}`, err.stack);
      throw err;
    }
  }

  /**
   * Removes a media file for a user.
   * @param userId - The ID of the user to remove the media for.
   * @param type - The type of media to remove.
   * @returns Promise<{ message: string }> - A message indicating the removal was successful.
   * @throws Error if any other error occurs.
   */
  async removeMedia(userId: string, type: MediaType) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: [type],
      });

      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      if (!user[type]) {
        throw new NotFoundException(`User ${userId} does not have ${type}`);
      }

      const media = user[type];

      // Delete avatar or cover image in user's folder
      const filePath = join(process.cwd(), 'uploads', media.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(
          `Deleted ${type} file for user ${user.id}: ${filePath}`,
          'REMOVE FILE',
        );
      } else {
        this.logger.log(
          `${type} file not found for user ${user.id}, skip delete`,
          'SKIPPING REMOVE FILE',
        );
      }

      user[type] = null;
      await this.userRepo.save(user);

      await this.mediaRepo.remove(media);

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
