import {
  Logger,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { MediaType } from '../../common/enums';
import { Media } from './entities/media.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateMediaDto } from './dtos/create-media.dto';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { Category } from '../categories/entities/category.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    private readonly userService: UsersService,
    private readonly productService: ProductsService,
    private readonly categoryService: CategoriesService,
  ) {}

  async findUserMedia(userId: string, type: MediaType) {
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

  async findUserImages(userId: string) {
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

  async findProductImages(productId: string) {
    try {
      const product = await this.productService.findOne(productId);
      return product.media;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to fetch product images`, err.stack);
      throw err;
    }
  }

  async createUserMedia(createMediaDto: CreateMediaDto) {
    try {
      const newMedia = this.mediaRepo.create(createMediaDto);
      return await this.mediaRepo.save(newMedia);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create user's media image`, err.stack);
      throw err;
    }
  }

  async uploadUserMedia(
    userId: string,
    file: Express.Multer.File,
    type: MediaType,
  ) {
    try {
      let media = await this.findUserMedia(userId, type);

      if (!media) {
        media = await this.createUserMedia({
          path: file.path.replace(/^.*users/, '/users'),
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size,
          type: type,
        });
      } else {
        media = await this.updateUserMedia(media, file, type);
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

  async updateUserMedia(
    media: Media,
    file: Express.Multer.File,
    type: MediaType,
  ) {
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

  async uploadCategoryImage(id: string, file: Express.Multer.File) {
    try {
      let category = await this.categoryService.findOne(id);

      if (!category.image) {
        const image = this.mediaRepo.create({
          path: file.path.replace(/^.*categories/, '/categories'),
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size,
          type: MediaType.CATEGORY,
        });

        await this.mediaRepo.save(image);
        category.image = image;
        await this.categoryRepo.save(category);
      } else {
        category = await this.updateCategoryImage(
          category,
          category.image,
          file,
        );
      }

      return category;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to upload category image`, err.stack);
      throw err;
    }
  }

  async updateCategoryImage(
    category: Category,
    image: Media,
    file: Express.Multer.File,
  ) {
    try {
      image.path = file.path.replace(/^.*categories/, '/categories');
      image.mimetype = file.mimetype;
      image.filename = file.filename;
      image.size = file.size;
      image.type = MediaType.CATEGORY;

      category.image = image;

      return category;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update category image`, err.stack);
      throw err;
    }
  }

  async uploadProductImages(productId: string, files: Express.Multer.File[]) {
    try {
      const product = await this.productService.findOne(productId);

      const mediaList = files.map((file) => {
        return this.mediaRepo.create({
          path: file.path.replace(/^.*products/, '/products'),
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size,
          type: MediaType.PRODUCT,
          product,
        });
      });

      await this.mediaRepo.save(mediaList);
      product.media = mediaList;
      await this.productRepo.save(product);

      return product;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to upload product images`, err.stack);
      throw err;
    }
  }

  async removeUserMedia(userId: string, type: MediaType) {
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
