import {
  Res,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ======================GET============================
  @Get()
  @HttpCode(HttpStatus.FOUND)
  // Get all categories
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':categoryId/products')
  @HttpCode(HttpStatus.FOUND)
  // Get products of a category
  findProducts(@Param('categoryId') categoryId: string) {
    return this.categoriesService.findProductsByCategory(categoryId);
  }

  @Get(':categoryId')
  @HttpCode(HttpStatus.FOUND)
  // Get category by categoryId
  findOne(@Param('categoryId') categoryId: string) {
    return this.categoriesService.findOne(categoryId);
  }

  // ======================POST============================
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  // Create category
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const category = await this.categoriesService.create(createCategoryDto);
    return res.location(`/categories/${category.id}`).json(category);
  }

  // ======================PATCH============================
  @Patch(':categoryId')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  // Update category
  async update(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    const category = await this.categoriesService.update(
      categoryId,
      updateCategoryDto,
    );
    return res.location(`/categories/${category.id}`).json(category);
  }

  // ======================DELETE============================
  @Delete(':categoryId')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  // Delete category
  remove(@Param('categoryId') categoryId: string) {
    return this.categoriesService.remove(categoryId);
  }
}
