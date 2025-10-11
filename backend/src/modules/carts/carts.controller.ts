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
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { Response } from 'express';

import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards';
import { CartsService } from './carts.service';
import { RolesGuard } from '../../common/guards';
import { CreateCartDto } from './dto/create-cart.dto';
import { RequestUser } from '../../common/interfaces';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CurrentUser, Roles } from '../../common/decorators';

@Controller('carts')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  // Finds all carts from all users.
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':cartId')
  // Finds a cart by cart ID.
  @HttpCode(HttpStatus.OK)
  findOne(@Param('cartId') cartId: string) {
    return this.cartsService.findOne(cartId);
  }

  @Get('user/cart-items')
  @HttpCode(HttpStatus.OK)
  // Finds all cart items in a user's cart.
  findUserCartItems(@CurrentUser() user: RequestUser) {
    return this.cartsService.findUserCartItems(user.id);
  }

  @Get('user/products')
  @Roles(Role.ADMIN, Role.CLIENT)
  @HttpCode(HttpStatus.OK)
  // Finds all products in a user's cart.
  findUserProducts(@CurrentUser() user: RequestUser) {
    return this.cartsService.findUserProductsFromCartByUserId(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Creates a new cart for a user.
  async create(@CurrentUser() user: RequestUser, @Res() res: Response) {
    const cart = await this.cartsService.create(user.id);
    return res.location(`/carts/${cart.id}`).json(cart);
  }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.CLIENT)
  // Adds a product to a cart.
  async addProductsToCart(
    @Body() createCartDto: CreateCartDto,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ) {
    const response = await this.cartsService.addProductsToCart(
      user.id,
      createCartDto,
    );

    // FIX: return cart id
    return res.location(`/carts/${response.cartItem.id}`).json(response);
  }

  @Patch('update-quantity')
  @Roles(Role.ADMIN, Role.CLIENT)
  @HttpCode(HttpStatus.OK)
  // Updates the quantity of a product in a user's cart.
  async updateQuantityFromUserCart(
    @Body() updateCartDto: UpdateCartDto,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ) {
    const response = await this.cartsService.updateQuantityFromUserCart(
      user.id,
      updateCartDto,
    );

    // FIX: return cart id
    return res.location(`/carts/${response.cartItem.id}`).json(response);
  }

  @Delete(':cartId')
  @HttpCode(HttpStatus.OK)
  // Removes a cart by its ID.
  async remove(@Param('cartId') cartId: string, @Res() res: Response) {
    const response = await this.cartsService.remove(cartId);
    return res.location(`/carts/${response.id}`).json(response);
  }

  @Delete('product/:productId')
  @Roles(Role.ADMIN, Role.CLIENT)
  @HttpCode(HttpStatus.OK)
  // Removes a product from a user's cart.
  async removeProductFromUserCart(
    @Param('productId') productId: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ) {
    const response = await this.cartsService.removeProductFromUserCart(
      user.id,
      productId,
    );
    return res.location(`/carts/${response.cartItem.id}`).json(response);
  }
}
