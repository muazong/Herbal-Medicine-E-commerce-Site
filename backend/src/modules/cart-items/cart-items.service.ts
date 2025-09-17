import { Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Cart } from '../carts/entities/cart.entity';
import { UsersService } from '../users/users.service';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  private readonly logger = new Logger(CartItemsService.name);

  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly userService: UsersService,
    private readonly productService: ProductsService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto) {
    const { userId, productId, quantity } = createCartItemDto;

    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['cart', 'cart.cartItems', 'cart.cartItems.product'],
      });
      if (!user) throw new NotFoundException('User not found');

      const product = await this.productRepo.findOne({
        where: { id: productId },
      });
      if (!product) throw new NotFoundException('Product not found');

      let cart = user.cart;
      if (!cart) {
        cart = this.cartRepo.create({ user });
        await this.cartRepo.save(cart);
        user.cart = cart;
        await this.userRepo.save(user);
      }

      let cartItem = cart.cartItems?.find(
        (item) => item.product.id === productId,
      );
      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        cartItem = this.cartItemRepo.create({ cart, product, quantity });
      }

      return await this.cartItemRepo.save(cartItem);
    } catch (error) {
      this.logger.error(
        `Failed to create cart item: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async findAll(userId: string) {
    return await this.cartItemRepo.find({
      where: { cart: { user: { id: userId } } },
      relations: ['product', 'cart'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} cartItem`;
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}
