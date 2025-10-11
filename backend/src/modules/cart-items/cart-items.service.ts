import {
  Logger,
  Inject,
  forwardRef,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { CartsService } from '../carts/carts.service';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  private readonly logger = new Logger(CartItemsService.name);

  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    private readonly productService: ProductsService,

    @Inject(forwardRef(() => CartsService))
    private readonly cartService: CartsService,
  ) {}

  /**
   * Finds all cart items.
   * @returns Promise<CartItem[]> - The found cart items.
   * @throws Error if any other error occurs.
   */
  async findAll(): Promise<CartItem[]> {
    try {
      return await this.cartItemRepo.find();
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to find all cart items', err.message);
      throw err;
    }
  }

  /**
   * Finds a cart item by its ID.
   * @param cartItemId - The ID of the cart item to find.
   * @returns Promise<CartItem> - The found cart item.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart item is not found.
   * @throws Error if any other error occurs.
   */
  async findOne(cartItemId: string): Promise<CartItem> {
    if (!isUUID(cartItemId)) {
      throw new BadRequestException('Invalid cart item id');
    }

    try {
      const existedCartItem = await this.cartItemRepo.findOne({
        where: { id: cartItemId },
        relations: ['product'],
      });

      if (!existedCartItem) {
        throw new NotFoundException('Cart item not found');
      }

      return existedCartItem;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to find cart item', err.message);
      throw err;
    }
  }

  /**
   * Finds a cart item by its cart ID and product ID.
   * @param cartId - The ID of the cart to find the cart item for.
   * @param productId - The ID of the product to find the cart item for.
   * @returns Promise<CartItem | null> - The found cart item or null if not found.
   * @throws BadRequestException if the ID is invalid.
   * @throws Error if any other error occurs.
   */
  async findOneByCartIdAndProductId(
    cartId: string,
    productId: string,
  ): Promise<CartItem | null> {
    if (!isUUID(cartId)) {
      throw new BadRequestException('Invalid cart id');
    }

    try {
      const existedCartItem = await this.cartItemRepo.findOne({
        where: { cart: { id: cartId }, product: { id: productId } },
        relations: ['product'],
      });

      return existedCartItem;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to find cart item', err.message);
      throw err;
    }
  }

  /**
   * Finds a cart item by its cart ID and product ID.
   * @param cartId - The ID of the cart to find the cart item for.
   * @param productId - The ID of the product to find the cart item for.
   * @returns Promise<CartItem[]> - The found cart items.
   * @throws BadRequestException if the ID is invalid.
   * @throws Error if any other error occurs.
   */
  async findCartItemsFromCart(cartId: string): Promise<CartItem[]> {
    try {
      return await this.cartItemRepo.findBy({
        cart: { id: cartId },
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to find user cart items', err.message);
      throw err;
    }
  }

  /**
   * Finds a cart item by its cart ID and product ID.
   * @param cartId - The ID of the cart to find the cart item for.
   * @param productId - The ID of the product to find the cart item for.
   * @returns Promise<CartItem[]> - The found cart items.
   * @throws BadRequestException if the ID is invalid.
   * @throws Error if any other error occurs.
   */
  async findProductsFromCart(cartId: string) {
    try {
      const cartItems = await this.cartItemRepo.find({
        where: { cart: { id: cartId } },
        relations: ['product'],
      });

      if (cartItems.length === 0) {
        return [];
      }

      return cartItems;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to find user products', err.message);
      throw err;
    }
  }

  /**
   * Creates a new cart item.
   * @param createCartItemDto - The cart item data to create.
   * @returns Promise<{ message: string; cartItem: CartItem }> - The created cart item.
   * @throws Error if any other error occurs.
   */
  async create(createCartItemDto: CreateCartItemDto): Promise<{
    message: string;
    cartItem: CartItem;
  }> {
    const { cartId, productId, quantity } = createCartItemDto;

    try {
      const cart = await this.cartService.findOne(cartId);
      const product = await this.productService.findOne(productId);

      const existedCartItem = await this.cartItemRepo.findOne({
        where: { cart: { id: cartId }, product: { id: productId } },
      });

      if (existedCartItem) {
        existedCartItem.quantity += quantity;

        const newCartItem = await this.cartItemRepo.save(existedCartItem);
        return {
          message: `${quantity} item(s) added to your cart.`,
          cartItem: newCartItem,
        };
      }

      const cartItem = this.cartItemRepo.create({
        cart,
        product,
        quantity,
      });

      const newCartItem = await this.cartItemRepo.save(cartItem);
      const cartItemReturn = (await this.cartItemRepo.findOne({
        where: { id: newCartItem.id },
        relations: ['product'],
      })) as CartItem;

      return {
        message: `${quantity} item(s) added to your cart.`,
        cartItem: cartItemReturn,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create cart item: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Updates a cart item.
   * @param cartItemId - The ID of the cart item to update.
   * @param quantity - The new quantity of the cart item.
   * @returns Promise<{ message: string; cartItem: CartItem }> - The updated cart item.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart item is not found.
   * @throws Error if any other error occurs.
   */
  async update(cartItemId: string, updateCartItemDto: UpdateCartItemDto) {
    const { quantity, isOrdered } = updateCartItemDto;
    let isUpdated = false;

    try {
      const cartItem = await this.findOne(cartItemId);

      if (quantity !== undefined) {
        cartItem.quantity = quantity;
        isUpdated = true;

        if (cartItem.quantity > cartItem.product.stock) {
          cartItem.quantity = cartItem.product.stock;
        }
      }

      if (isOrdered !== undefined) {
        cartItem.isOrdered = isOrdered;
        isUpdated = true;
      }

      if (!isUpdated) {
        return {
          message: 'Nothing to update',
          cartItem: cartItem,
        };
      }

      const updatedCartItem = await this.cartItemRepo.save(cartItem);
      const cartItemReturn = (await this.cartItemRepo.findOne({
        where: { id: updatedCartItem.id },
        relations: ['product'],
      })) as CartItem;

      return {
        message: `${quantity} item(s) added to your cart.`,
        cartItem: cartItemReturn,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to update cart item', err.message);
      throw err;
    }
  }

  /**
   * Removes a cart item.
   * @param id - The ID of the cart item to remove.
   * @returns Promise<{ message: string; cartItem: CartItem }> - The removed cart item.
   * @throws BadRequestException if the ID is invalid.
   * @throws NotFoundException if the cart item is not found.
   * @throws Error if any other error occurs.
   */
  async remove(id: string): Promise<{
    message: string;
    cartItem: CartItem;
  }> {
    try {
      const cartItem = await this.findOne(id);
      const cartItemDeleted = await this.cartItemRepo.remove(cartItem);

      return {
        message: `Cart item with id: ${id} removed`,
        cartItem: cartItemDeleted,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to remove cart item', err.message);
      throw err;
    }
  }
}
