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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards';
import { RolesGuard } from '../../common/guards';
import { mediaStorage } from '../../common/utils';
import { Public, Roles } from '../../common/decorators';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Roles(Role.ADMIN)
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ======================GET============================
  @Get()
  @Public()
  @HttpCode(HttpStatus.FOUND)
  // Get all categories
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':categoryId/products')
  @Public()
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
  @HttpCode(HttpStatus.CREATED)
  // Create category
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const category = await this.categoriesService.create(createCategoryDto);
    return res.location(`/categories/${category.id}`).json(category);
  }

  @Post(':categoryId/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: mediaStorage('category'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  // Upload category image
  async uploadImage(
    @Param('categoryId') categoryId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const category = await this.categoriesService.uploadImage(categoryId, file);
    return res.location(`/categories/${category.id}`).json(category);
  }

  // ======================PATCH============================
  @Patch(':categoryId')
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
  @HttpCode(HttpStatus.OK)
  // Delete category
  remove(@Param('categoryId') categoryId: string) {
    return this.categoriesService.remove(categoryId);
  }
}
