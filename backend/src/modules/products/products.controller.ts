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
import { RolesGuard } from '../../common/guards';
import { ProductsService } from './products.service';
import { Public, Roles } from '../../common/decorators';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Roles(Role.ADMIN)
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.FOUND)
  // Finds all products.
  findAll(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
    @Query('sort') sort: 'asc' | 'desc',
    @Query('search') search: string,
  ) {
    return this.productsService.findAll(limit, page, sort, search);
  }

  @Public()
  @Get(':productId')
  @HttpCode(HttpStatus.FOUND)
  // Finds a product by its ID.
  findOne(@Param('productId') productId: string) {
    return this.productsService.findOne(productId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Creates a new product.
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    const product = await this.productsService.create(createProductDto);
    return res.location(`/product/${product.id}`).json(product);
  }

  @Post(':productId/category')
  @HttpCode(HttpStatus.CREATED)
  // Assigns a category to a product.
  async assignCategory(
    @Param('productId') productId: string,
    @Body('categoryId') categoryId: string,
    @Res() res: Response,
  ) {
    const product = await this.productsService.assignCategory(
      productId,
      categoryId,
    );
    return res.location(`/product/${product.id}`).json(product);
  }

  @Patch(':productId')
  @HttpCode(HttpStatus.OK)
  // Updates a product.
  async update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    const product = await this.productsService.update(
      productId,
      updateProductDto,
    );
    return res.location(`/product/${product.id}`).json(product);
  }

  @Delete(':productId/category')
  @HttpCode(HttpStatus.OK)
  // Unsigneds a category from a product.
  unsignedCategory(@Param('productId') productId: string) {
    return this.productsService.unsignedCategory(productId);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  // Removes a product.
  remove(@Param('productId') productId: string) {
    return this.productsService.remove(productId);
  }
}
