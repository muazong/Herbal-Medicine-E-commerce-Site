import {
  Res,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';

import { MediaType, Role } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards';
import { UsersService } from './users.service';
import { Roles } from '../../common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { mediaStorage } from '../../common/utils';

@Controller('users')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ======================GET============================
  @Get()
  @HttpCode(HttpStatus.OK)
  // Get all users
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('sort') sort: 'asc' | 'desc',
  ) {
    return this.usersService.findAll(limit, page, sort);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  // Get user by id
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ======================POST============================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Create user with admin role
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.create(createUserDto);
    return res.location(`/users/${user.id}`).json(user);
  }

  @Post(':userId/avatar')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: mediaStorage('avatar'),
    }),
  )
  // Upload user avatar
  async uploadAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const avatar = await this.usersService.uploadMedia(
      userId,
      file,
      MediaType.AVATAR,
    );
    return res.location(`/media/user/${userId}/avatar`).json(avatar);
  }

  @Post(':userId/cover')
  @Roles(Role.ADMIN, Role.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: mediaStorage('cover'),
    }),
  )
  // Upload user cover
  async uploadCover(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const cover = await this.usersService.uploadMedia(
      userId,
      file,
      MediaType.COVER,
    );
    return res.location(`/media/user/${userId}/cover`).json(cover);
  }

  // ======================PATCH============================
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  // Update user
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return res.location(`/users/${user.id}`).json(user);
  }

  // ======================DELETE============================
  @Delete(':id')
  @Roles(Role.ADMIN, Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  // Delete user
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
