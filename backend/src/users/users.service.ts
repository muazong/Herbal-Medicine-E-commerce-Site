import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DefaultImages } from '../common/contances';
import { Media } from '../media/entities/media.entity';
import { join } from 'path';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const avatar = new Media({
        path: DefaultImages.AVATAR,
        filename: 'default_avatar',
        mimetype: 'svg',
        size: 0,
      });
      const cover = new Media({
        path: DefaultImages.COVER,
        filename: 'default_cover',
        mimetype: 'svg',
        size: 0,
      });
      await this.mediaRepo.save([avatar, cover]);

      const user = this.userRepo.create({
        avatar,
        cover,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: createUserDto.password,
        username: createUserDto.username,
      });

      await this.userRepo.save(user);

      return { ...createUserDto };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create user: ${err.message}`, err.stack);
      throw err;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepo.find();
      return users;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to fetch users: ${err.message}`, err.stack);
      throw err;
    }
  }

  async findOne(id: string): Promise<User> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const user = await this.userRepo.findOneBy({ id });

      if (!user) {
        this.logger.log(`User not found with id: ${id}`);
        throw new NotFoundException('User not found!');
      }

      return user;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to fetch user', err.stack);
      throw err;
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    try {
      const user = await this.findOne(id);

      Object.assign(user, updateUserDto);
      await this.userRepo.save(user);
      this.logger.log(`Updated the user with id: ${id}`);

      return updateUserDto;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update user: ${err.message}`, err.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const user = await this.findOne(id);

      if (user.avatar) {
        const avatarPath = join(process.cwd(), user.avatar.path);

        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(user.avatar.path);
        }
        await this.mediaRepo.remove(user.avatar);
      }
      if (user.cover) {
        const coverPath = join(process.cwd(), user.cover.path);

        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(user.cover.path);
        }

        await this.mediaRepo.remove(user.cover);
      }

      await this.userRepo.remove(user);
      this.logger.log(`Delete the user with id: ${id}`);

      const userFolder = join(process.cwd(), 'uploads', 'users', id);

      if (fs.existsSync(userFolder)) {
        fs.rmSync(userFolder, { recursive: true, force: true });
        this.logger.log(`Deleted folder for user ${id}: ${userFolder}`);
      } else {
        this.logger.log(
          `Folder for user ${id} does not exist, skipping deletion`,
        );
      }

      return { message: 'Delete the user successfully!' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to remove user: ${err.message}`, err.stack);
      throw error;
    }
  }
}
