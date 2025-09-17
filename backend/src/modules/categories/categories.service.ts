import {
  Inject,
  Logger,
  forwardRef,
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { pickBy } from 'lodash';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const existedCategory = await this.categoryRepo.findOneBy({
        name: createCategoryDto.name,
      });

      if (existedCategory) {
        throw new ConflictException('Category already exists!');
      }

      const newCategory = this.categoryRepo.create(createCategoryDto);
      return await this.categoryRepo.save(newCategory);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create category: ${err.message}`, err.stack);
      throw err;
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepo.find();
      return categories;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to find all categories: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  async findProducts(id: string) {
    try {
      const existedCategory = await this.findOne(id);
      const products = await this.productService.findAll();

      return products.filter((product) => {
        if (product.category) {
          return product.category.id === existedCategory.id;
        }
        return false;
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to find all categories: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid category ID!');
    }

    try {
      const category = await this.categoryRepo.findOneBy({ id });

      if (!category) {
        this.logger.warn(
          `Category with id ${id} not found`,
          'CategoriesService',
        );
        throw new BadRequestException(`Category with id ${id} not found`);
      }

      return category;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to find category: ${err.message}`, err.stack);
      throw err;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const existedCategory = await this.findOne(id);

      const fieldsToUpdate = pickBy(
        updateCategoryDto,
        (value) => value !== undefined,
      );
      Object.assign(existedCategory, fieldsToUpdate);

      return await this.categoryRepo.save(existedCategory);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update category: ${err.message}`, err.stack);
      throw err;
    }
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid category ID!');
    }

    try {
      return await this.categoryRepo.delete({ id });
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete category: ${err.message}`, err.stack);
      throw err;
    }
  }
}
