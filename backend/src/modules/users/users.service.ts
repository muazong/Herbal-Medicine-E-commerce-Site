import {
  Logger,
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { isUUID } from 'class-validator';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserProvider } from '../../common/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Media } from '../media/entities/media.entity';
import { InitialUserMedia } from '../../common/contances';
import { generateHashedPassword } from '../../common/utils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const [existedByUsername, existedByEmail] = await Promise.all([
      this.userRepo.findOneBy({ username: createUserDto.username }),
      this.userRepo.findOneBy({ email: createUserDto.email }),
    ]);

    if (existedByUsername) {
      throw new ConflictException('Username already exists!');
    }

    if (existedByEmail) {
      throw new ConflictException('Email already exists!');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const avatar = queryRunner.manager.create(
        Media,
        InitialUserMedia['avatar'],
      );
      const cover = queryRunner.manager.create(
        Media,
        InitialUserMedia['cover'],
      );
      await queryRunner.manager.save([avatar, cover]);

      const newUser = queryRunner.manager.create(User, {
        ...createUserDto,
        avatar,
        cover,
        password: await generateHashedPassword(createUserDto.password),
        provider: UserProvider.LOCAL,
      });
      await queryRunner.manager.save(newUser);

      await queryRunner.commitTransaction();
      return { ...newUser };
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Rollback if an error occurs

      const err = error as Error;
      this.logger.error(`Failed to create user: ${err.message}`, err.stack);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    limit: number = 10,
    page = 1,
    sort: 'desc' | 'asc' = 'desc',
  ): Promise<User[]> {
    try {
      const users = await this.userRepo.find({
        take: limit,
        skip: (page - 1) * limit,
        order: { createdAt: sort },
      });
      return users;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to fetch users: ${err.message}`, err.stack);
      throw err;
    }
  }

  async findOne(id: string): Promise<User> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID!');
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

      return user;
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

        const avatar = user.avatar;
        user.avatar = null; // remove FK with avatar before remove user

        await this.userRepo.save(user);
        await this.mediaRepo.remove(avatar);
      }
      if (user.cover) {
        const coverPath = join(process.cwd(), user.cover.path);

        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(user.cover.path);
        }

        const cover = user.cover;
        user.cover = null; // remove FK with cover before remove user

        await this.userRepo.save(user);
        await this.mediaRepo.remove(cover);
      }

      await this.userRepo.remove(user);
      this.logger.log(`Delete the user with id: ${id}`);

      const userFolder = join(process.cwd(), 'uploads', 'users', id);

      if (fs.existsSync(userFolder)) {
        fs.rmSync(userFolder, { recursive: true, force: true });
        this.logger.log(
          `Deleted folder for user ${id}: ${userFolder}`,
          'REMOVE FOLDER',
        );
      } else {
        this.logger.log(
          `Folder for user ${id} does not exist, skipping deletion`,
          'SKIPPING REMOVE FOLDER',
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
