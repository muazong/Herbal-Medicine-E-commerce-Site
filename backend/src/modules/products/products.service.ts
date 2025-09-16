import {
  Logger,
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

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
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

  async findAll(
    limit: number = 10,
    page = 1,
    sort: 'desc' | 'asc' = 'desc',
    search?: string,
  ) {
    try {
      if (search) {
        const products = await this.productRepo.find();

        return products.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      const products = await this.productRepo.find({
        take: limit,
        skip: (page - 1) * limit,
        order: {
          createdAt: sort,
        },
      });

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

  async findOne(id: string) {
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

  async update(id: string, updateProductDto: UpdateProductDto) {
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

  async remove(id: string) {
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
