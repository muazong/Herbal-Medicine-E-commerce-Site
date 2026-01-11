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
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { CategoryMediaService } from '../media/services';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,

    @Inject(forwardRef(() => CategoryMediaService))
    private readonly categoryMediaService: CategoryMediaService,
  ) {}

  /**
   * Creates a new category.
   * @param createCategoryDto - The category data to create.
   * @returns Promise<Category> - The created category.
   * @throws ConflictException if a category with the same name already exists.
   * @throws Error if any other error occurs.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
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

  /**
   * Upload category image
   * @param id category id
   * @param file file to upload
   * @returns Promise<Category> - category
   * @throws Error
   */
  async uploadImage(id: string, file: Express.Multer.File): Promise<Category> {
    return await this.categoryMediaService.uploadImage(id, file);
  }

  /**
   * Finds all categories.
   * @returns Promise<Category[]> - The list of categories.
   * @throws Error if any other error occurs.
   */
  async findAll(limit: number = 0, page: number = 1): Promise<Category[]> {
    try {
      if (limit) {
        return await this.categoryRepo.find({
          take: limit,
          skip: (page - 1) * limit,
          order: {
            createdAt: 'DESC',
          },
        });
      }

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

  /**
   * Finds all categories pages
   * @returns Promise<number> - The number of pages
   * @throws Error if any other error occurs.
   */
  async findAllPages() {
    try {
      const count = await this.categoryRepo.count();
      const pages = Math.ceil(count / 9);
      return pages;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to find all categories pages: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Finds all products in a category.
   * @param categoryId - The ID of the category to find products in.
   * @returns Promise<Product[]> - The list of products in the category.
   * @throws Error if any other error occurs.
   */
  async findProductsByCategory(
    categoryId: string,
    limit: number,
  ): Promise<Product[]> {
    try {
      const existedCategory = await this.categoryRepo.findOne({
        relations: ['products'],
        where: { id: categoryId },
      });

      const products = existedCategory?.products;
      if (!products) return [];
      return products.slice(0, limit);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to find all categories: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Finds a category by ID.
   * @param categoryId - The ID of the category to find.
   * @returns Promise<Category> - The category with the given ID.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the category is not found.
   * @throws Error if any other error occurs.
   */
  async findOne(categoryId: string): Promise<Category> {
    if (!isUUID(categoryId)) {
      throw new BadRequestException('Invalid category ID!');
    }

    try {
      const category = await this.categoryRepo.findOneBy({ id: categoryId });

      if (!category) {
        this.logger.warn(
          `Category with categoryId ${categoryId} not found`,
          'CategoriesService',
        );
        throw new BadRequestException(
          `Category with categoryId ${categoryId} not found`,
        );
      }

      return category;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to find category: ${err.message}`, err.stack);
      throw err;
    }
  }

  /**
   * Updates a category.
   * @param categoryId - The ID of the category to update.
   * @param updateCategoryDto - The updated category data.
   * @returns Promise<Category> - The updated category.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the category is not found.
   * @throws Error if any other error occurs.
   */
  async update(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const existedCategory = await this.findOne(categoryId);

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

  /**
   * Deletes a category.
   * @param categoryId - The ID of the category to delete.
   * @returns Promise<DeleteResult | undefined> - The result of the deletion.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the category is not found.
   * @throws Error if any other error occurs.
   */
  async remove(categoryId: string): Promise<{ message: string } | undefined> {
    if (!isUUID(categoryId)) {
      throw new BadRequestException('Invalid category ID!');
    }

    try {
      const result = await this.categoryRepo.delete({ id: categoryId });

      if (result.affected !== 0) {
        return { message: 'Delete the category successfully!' };
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete category: ${err.message}`, err.stack);
      throw err;
    }
  }
}
