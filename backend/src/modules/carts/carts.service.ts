import {
  Logger,
  Inject,
  forwardRef,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UsersService } from '../users/users.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from '../products/products.service';
import { CartItem } from '../cart-items/entities/cart-item.entity';
import { CartItemsService } from '../cart-items/cart-items.service';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);

  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,

    private readonly userService: UsersService,
    private readonly productService: ProductsService,

    @Inject(forwardRef(() => CartItemsService))
    private readonly cartItemService: CartItemsService,
  ) {}

  /**
   * Finds all carts.
   * @returns Promise<Cart[]> - The list of carts.
   * @throws Error if any other error occurs.
   */
  async findAll(): Promise<Cart[]> {
    try {
      return await this.cartRepo.find();
    } catch (error) {
      this.logger.error('Failed to find all carts', (error as Error).message);
      throw error;
    }
  }

  /**
   * Finds a cart by its ID.
   * @param cartId - The ID of the cart to find.
   * @returns Promise<Cart> - The cart with the given ID.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart is not found.
   * @throws Error if any other error occurs.
   */
  async findOne(cartId: string): Promise<Cart> {
    if (!isUUID(cartId)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      const cart = await this.cartRepo.findOneBy({
        id: cartId,
      });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      return cart;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to find cart', err.message);
      throw err;
    }
  }

  /**
   * Finds a cart by its user ID.
   * @param userId - The ID of the user to find the cart for.
   * @returns Promise<Cart> - The cart for the given user.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart is not found.
   * @throws Error if any other error occurs.
   */
  async findCartByUserId(userId: string): Promise<Cart> {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      const cart = await this.cartRepo.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!cart) {
        return await this.create(userId);
      }

      return cart;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to find cart', err.message);
      throw err;
    }
  }

  /**
   * Finds all cart items in a user's cart.
   * @param userId - The ID of the user to find the cart items for.
   * @returns Promise<CartItem[]> - The cart items for the given user.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart items are not found.
   * @throws Error if any other error occurs.
   */
  async findUserCartItems(userId: string): Promise<CartItem[] | undefined> {
    try {
      const cart = await this.cartRepo.findOneBy({ userId });
      if (!cart) return;
      return await this.cartItemService.findCartItemsFromCart(cart.id);
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to find user products', err.message);
      throw err;
    }
  }

  /**
   * Finds all products in a user's cart.
   * @param userId - The ID of the user to find the products for.
   * @returns Promise<CartItem[]> - The products for the given user.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the products are not found.
   * @throws Error if any other error occurs.
   */
  async findUserProductsFromCart(userId: string): Promise<CartItem[]> {
    try {
      const cart = await this.cartRepo.findOne({
        where: { user: { id: userId } },
      });

      if (!cart) return [];

      return await this.cartItemService.findProductsFromCart(cart.id);
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to find user products', err.message);
      throw err;
    }
  }

  /**
   * Adds a product to a user's cart.
   * @param userId - The ID of the user to add the product to.
   * @param createCartDto - The data to create the cart.
   * @returns Promise<CartItem> - The created cart item.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart is not found.
   * @throws ConflictException if the product is already in the cart.
   * @throws Error if any other error occurs.
   */
  async addProductsToCart(
    userId: string,
    createCartDto: CreateCartDto,
  ): Promise<{
    message: string;
    cartItem: CartItem;
  }> {
    const { productId, quantity } = createCartDto;

    try {
      const cart = await this.findCartByUserId(userId);
      const product = await this.productService.findOne(productId);
      const existedCartItem =
        await this.cartItemService.findOneByCartIdAndProductId(
          cart.id,
          productId,
        );

      if (existedCartItem) {
        return await this.cartItemService.update(existedCartItem.id, quantity);
      }

      let newQuantity = quantity;

      if (quantity >= product.stock) {
        newQuantity = product.stock;
      }

      return await this.cartItemService.create({
        cartId: cart.id,
        productId,
        quantity: newQuantity,
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to add product to cart', err.message);
      throw err;
    }
  }

  /**
   * Updates the quantity of a product in a user's cart.
   * @param userId - The ID of the user to update the quantity for.
   * @param updateCartDto - The data to update the quantity.
   * @returns Promise<CartItem> - The updated cart item.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart item is not found.
   * @throws Error if any other error occurs.
   */
  async updateQuantityFromUserCart(
    userId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<{
    message: string;
    cartItem: CartItem;
  }> {
    const { productId, quantity } = updateCartDto;

    try {
      const user = await this.userService.findOne(userId);
      const cart = await this.findCartByUserId(user.id);

      const existedCartItem =
        await this.cartItemService.findOneByCartIdAndProductId(
          cart.id,
          productId,
        );

      if (!existedCartItem) {
        throw new NotFoundException('Cart item not found');
      }

      return await this.cartItemService.update(existedCartItem.id, quantity);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        'Failed to update quantity from user cart',
        err.message,
      );
      throw err;
    }
  }

  /**
   * Creates a new cart for a user.
   * @param userId - The ID of the user to create the cart for.
   * @returns Promise<Cart> - The created cart.
   * @throws BadRequestException if the ID is invalid.
   * @throws ConflictException if the user already has a cart.
   * @throws Error if any other error occurs.
   */
  async create(userId: string): Promise<Cart> {
    try {
      const user = await this.userService.findOne(userId);
      const cart = await this.cartRepo.findOne({
        where: { user: { id: user.id } },
      });

      if (cart) {
        throw new ConflictException(
          `user with id ${userId} already has a cart`,
        );
      }

      const newCart = this.cartRepo.create({ user });
      return await this.cartRepo.save(newCart);
    } catch (error) {
      this.logger.error('Failed to create cart', error.message);
      throw error;
    }
  }

  /**
   * Removes a cart by its ID.
   * @param cartId - The ID of the cart to remove.
   * @returns Promise<Cart> - The removed cart.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart is not found.
   * @throws Error if any other error occurs.
   */
  async remove(cartId: string): Promise<Cart> {
    try {
      const cart = await this.findOne(cartId);
      await this.cartItemService.remove(cart.id);
      return await this.cartRepo.remove(cart);
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to remove cart', err.message);
      throw err;
    }
  }

  /**
   * Removes a product from a user's cart.
   * @param userId - The ID of the user to remove the product from.
   * @param productId - The ID of the product to remove.
   * @returns Promise<CartItem> - The removed cart item.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart item is not found.
   * @throws Error if any other error occurs.
   */
  async removeProductFromUserCart(
    userId: string,
    productId: string,
  ): Promise<{
    message: string;
    cartItem: CartItem;
  }> {
    try {
      const user = await this.userService.findOne(userId);
      const cart = await this.findCartByUserId(user.id);

      const existedCartItem =
        await this.cartItemService.findOneByCartIdAndProductId(
          cart.id,
          productId,
        );

      if (!existedCartItem) {
        throw new NotFoundException('Cart item not found');
      }

      return await this.cartItemService.remove(existedCartItem.id);
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to remove product from user cart', err.message);
      throw err;
    }
  }
}
