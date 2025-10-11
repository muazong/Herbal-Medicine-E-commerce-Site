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
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Get()
  @HttpCode(HttpStatus.FOUND)
  // Find all cart items
  findAll() {
    return this.cartItemsService.findAll();
  }

  @Get(':cartItemId')
  @HttpCode(HttpStatus.FOUND)
  // Find a cart item
  findOne(@Param('cartItemId') cartItemId: string) {
    return this.cartItemsService.findOne(cartItemId);
  }

  @Get('cart/:cartId/products/:productId')
  @HttpCode(HttpStatus.FOUND)
  // Find a cart item by cart ID and product ID
  findOneByCartIdAndProductId(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartItemsService.findOneByCartIdAndProductId(cartId, productId);
  }

  @Get('cart/:cartId')
  @HttpCode(HttpStatus.FOUND)
  // Find cart items from cart
  findCartItemsFromCart(@Param('cartId') cartId: string) {
    return this.cartItemsService.findCartItemsFromCart(cartId);
  }

  @Get('cart/:cartId/products')
  @HttpCode(HttpStatus.FOUND)
  // Find products from cart
  findProductsFromCart(@Param('cartId') cartId: string) {
    return this.cartItemsService.findProductsFromCart(cartId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Create a cart item
  async create(
    @Body() createCartItemDto: CreateCartItemDto,
    @Res() res: Response,
  ) {
    const response = await this.cartItemsService.create(createCartItemDto);
    return res.location(`/cart-items/${response.cartItem.id}`).json(response);
  }

  @Patch(':cartItemId')
  @HttpCode(HttpStatus.OK)
  // Update a cart item
  async update(
    @Param('cartItemId') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Res() res: Response,
  ) {
    const response = await this.cartItemsService.update(
      cartItemId,
      updateCartItemDto,
    );
    return res.location(`/cart-items/${response.cartItem.id}`).json(response);
  }

  @Delete(':cartItemId')
  @HttpCode(HttpStatus.OK)
  // Remove a cart item
  async remove(@Param('cartItemId') cartItemId: string, @Res() res: Response) {
    const response = await this.cartItemsService.remove(cartItemId);
    return res.location(`/cart-items/${response.cartItem.id}`).json(response);
  }
}
