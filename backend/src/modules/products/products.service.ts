import {
  Inject,
  Logger,
  forwardRef,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { pickBy } from 'lodash';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  /**
   * Creates a new product.
   * @param createProductDto - The product data to create.
   * @returns Promise<Product> - The created product.
   * @throws {ConflictException} - If a product with the same name already exists.
   * @throws {Error} - If an error occurs during the product creation process.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existedProduct = await this.productRepo.findOneBy({
      name: createProductDto.name,
    });

    if (existedProduct) {
      throw new ConflictException('Product already exists!');
    }

    try {
      const newProduct = this.productRepo.create(createProductDto);
      return await this.productRepo.save(newProduct);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to create product: ${err.message}`, err.stack);
      throw err;
    }
  }

  /**
   * Finds all products.
   * @param limit - The maximum number of products to return.
   * @param page - The page number to retrieve.
   * @param sort - The sort order of the products.
   * @param search - The search query to filter products by name.
   * @returns Promise<Product[]> - An array of products.
   * @throws {Error} - If an error occurs during the product retrieval process.
   */
  async findAll(
    limit?: number,
    page?: number,
    sort: 'desc' | 'asc' = 'desc',
    search?: string,
  ): Promise<Product[]> {
    try {
      if (limit && page) {
        return await this.productRepo.find({
          take: limit,
          skip: (page - 1) * limit,
          order: {
            createdAt: sort,
          },
        });
      }

      const products = await this.productRepo.find();

      if (search) {
        return products.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      return products;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to find all products: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Finds a product by its ID.
   * @param id - The ID of the product to find.
   * @returns Promise<Product> - The found product.
   * @throws {BadRequestException} - If the ID is invalid.
   * @throws {NotFoundException} - If the product is not found.
   * @throws {Error} - If an error occurs during the product retrieval process.
   */
  async findOne(id: string): Promise<Product> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid product ID!');
    }

    try {
      const product = await this.productRepo.findOneBy({ id });

      if (!product) {
        this.logger.warn(`Product with id ${id} not found`, 'ProductsService');
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to find product: ${err.message}`, err.stack);
      throw err;
    }
  }

  /**
   * Assigns a category to a product.
   * @param productId - The ID of the product to assign the category to.
   * @param categoryId - The ID of the category to assign.
   * @returns Promise<Product> - The updated product.
   * @throws {BadRequestException} - If the product has no category.
   * @throws {Error} - If an error occurs during the category assignment process.
   */
  async assignCategory(
    productId: string,
    categoryId: string,
  ): Promise<Product> {
    try {
      const existedCategory = await this.categoriesService.findOne(categoryId);
      const existedProduct = await this.findOne(productId);

      existedProduct.category = existedCategory;
      return await this.productRepo.save(existedProduct);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to assign category to product: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Unsigneds a category from a product.
   * @param productId - The ID of the product to unsigned the category from.
   * @returns Promise<Product> - The updated product.
   * @throws {BadRequestException} - If the product has no category.
   * @throws {Error} - If an error occurs during the category unsigned process.
   */
  async unsignedCategory(productId: string): Promise<Product> {
    try {
      const existedProduct = await this.findOne(productId);

      if (!existedProduct.category) {
        throw new BadRequestException('Product has no category!');
      }

      existedProduct.category = null;
      await this.productRepo.save(existedProduct);

      return existedProduct;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to unsigned category to product: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Updates a product.
   * @param id - The ID of the product to update.
   * @param updateProductDto - The updated product data.
   * @returns Promise<Product> - The updated product.
   * @throws {BadRequestException} - If the ID is invalid.
   * @throws {NotFoundException} - If the product is not found.
   * @throws {Error} - If an error occurs during the product update process.
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const existedProduct = await this.findOne(id);

      const fieldsToUpdate = pickBy(
        updateProductDto,
        (value) => value !== undefined,
      );

      Object.assign(existedProduct, fieldsToUpdate);
      await this.productRepo.save(existedProduct);

      return existedProduct;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update product: ${err.message}`, err.stack);
      throw err;
    }
  }

  /**
   * Removes a product.
   * @param id - The ID of the product to remove.
   * @returns Promise<{ message: string }> - A message indicating the success of the removal.
   * @throws {BadRequestException} - If the ID is invalid.
   * @throws {NotFoundException} - If the product is not found.
   * @throws {Error} - If an error occurs during the product removal process.
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.findOne(id);
      await this.productRepo.delete(id);

      return { message: 'Product deleted successfully' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete product: ${err.message}`, err.stack);
      throw err;
    }
  }
}
