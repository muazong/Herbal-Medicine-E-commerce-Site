import {
  Logger,
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { pickBy } from 'lodash';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Media } from '../media/entities/media.entity';
import { generateHashedPassword } from '../../common/utils';
import { AccountStatus, MediaType } from '../../common/enums';
import { UserMediaService } from '../media/services';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,

    @Inject(forwardRef(() => UserMediaService))
    private readonly userMediaService: UserMediaService,
  ) {}

  /**
   * Creates a new user.
   * @param createUserDto - The user data to create.
   * @returns Promise<User> - The created user.
   * @throws ConflictException if email already exists.
   * @throws Error if any other error occurs.
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'generateFullNameOnUpdate'>> {
    const existedByEmail = await this.userRepo.findOneBy({
      email: createUserDto.email,
    });

    if (existedByEmail) {
      throw new ConflictException('Email already exists!');
    }

    try {
      const newUser = this.userRepo.create({
        ...createUserDto,
        password: await generateHashedPassword(createUserDto.password),
      });

      const { password, ...user } = await this.userRepo.save(newUser);

      return user;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create user: ${err.message}`, err.stack);
      throw err;
    }
  }

  /**
   * Finds all users.
   * @param limit - The number of users to fetch.
   * @param page - The page number to fetch.
   * @param sort - The sort order of the users.
   * @returns Promise<User[]> - The list of users.
   * @throws Error if any other error occurs.
   */
  async findAll(
    limit: number = 9,
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

  /**
   * Finds a user by ID.
   * @param id - The ID of the user to fetch.
   * @returns Promise<User> - The user with the given ID.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the user is not found.
   * @throws Error if any other error occurs.
   */
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

  /**
   * Finds all users pages.
   * @returns Promise<number> - The number of pages.
   * @throws Error if any other error occurs.
   */
  async getPages() {
    try {
      const count = await this.userRepo.count();
      const pages = Math.ceil(count / 9);
      return pages;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to find all users pages: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Updates a user.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The updated user data.
   * @returns Promise<User> - The updated user.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the user is not found.
   * @throws Error if any other error occurs.
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const fieldsToUpdate = pickBy(
        updateUserDto,
        (value) => value !== undefined,
      );

      if ('password' in fieldsToUpdate) {
        fieldsToUpdate.password = await generateHashedPassword(
          fieldsToUpdate.password!,
        );
      }

      Object.assign(user, fieldsToUpdate);
      this.logger.log(`Updated the user with id: ${id}`);

      return await this.userRepo.save(user);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update user: ${err.message}`, err.stack);
      throw error;
    }
  }

  /**
   * Uploads user media
   * @param user - The ID of the user to upload the media for.
   * @param file - The media file to upload.
   * @param type - The type of media to upload.
   * @returns Promise<Media> - The uploaded media file.
   * @throws Error if any other error occurs.
   */
  async uploadMedia(
    userId: string,
    file: Express.Multer.File,
    type: MediaType,
  ) {
    return this.userMediaService.uploadMedia(userId, file, type);
  }

  async countActiveUsers(): Promise<number> {
    return this.userRepo.count({
      where: {
        status: AccountStatus.ACTIVE,
      },
    });
  }

  /**
   * Deletes a user.
   * @param id - The ID of the user to delete.
   * @returns Promise<{ message: string }> - A message indicating the deletion was successful.
   * @throws Error if any other error occurs.
   */
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
