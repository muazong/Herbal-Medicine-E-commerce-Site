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
} from '@nestjs/common';
import { Response } from 'express';

import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards';
import { UsersService } from './users.service';
import { Roles } from '../../common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('users')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Create user with admin role
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.create(createUserDto);
    return res.location(`/users/${user.id}`).json(user);
  }

  @Get()
  @HttpCode(HttpStatus.FOUND)
  // Get all users
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('sort') sort: 'asc' | 'desc',
  ) {
    return this.usersService.findAll(limit, page, sort);
  }

  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  // Get user by id
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

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

  @Delete(':id')
  @Roles(Role.ADMIN, Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  // Delete user
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
