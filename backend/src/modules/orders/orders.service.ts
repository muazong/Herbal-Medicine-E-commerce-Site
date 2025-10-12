import { pickBy } from 'lodash';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger, Injectable, BadRequestException } from '@nestjs/common';

import { Order } from './entities/order.entity';
import { UsersService } from '../users/users.service';
import { CartsService } from '../carts/carts.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartItemsService } from '../cart-items/cart-items.service';
import { OrderItemsService } from '../order-items/order-items.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,

    private readonly cartsService: CartsService,
    private readonly usersService: UsersService,
    private readonly cartItemsService: CartItemsService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  /**
   * Find all orders
   * @returns Promise<Order[]> - An array of orders
   * @throws Error - If the order repository fails to fetch orders
   */
  async findAll(): Promise<Order[]> {
    try {
      return await this.orderRepo.find();
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to fetch orders', err.stack);
      throw err;
    }
  }

  /**
   * Find one order by ID
   * @param orderId - The ID of the order to fetch
   * @returns Promise<Order> - The order with the given ID
   * @throws Error - If the order repository fails to fetch the order
   */
  async findOne(orderId: string): Promise<Order> {
    if (!isUUID(orderId)) {
      throw new BadRequestException('Invalid order ID!');
    }

    try {
      const order = await this.orderRepo.findOneBy({ id: orderId });

      if (!order) {
        this.logger.log(`Order not found with id: ${orderId}`);
        throw new Error('Order not found!');
      }

      return order;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to fetch order', err.stack);
      throw err;
    }
  }

  async findUserProductsIsOrdered(userId: string) {
    try {
      const user = await this.usersService.findOne(userId);
      const orders = await this.orderRepo.find({
        where: { user: { id: user.id } },
      });
      return orders;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to fetch order', err.stack);
      throw err;
    }
  }

  /**
   * Find one order by user ID
   * @param userId - The ID of the user to fetch the order for
   * @returns Promise<Order | null> - The order for the given user or null if not found
   * @throws Error - If the order repository fails to fetch the order
   */
  async findOneByUserId(userId: string): Promise<Order | null> {
    try {
      return await this.orderRepo.findOne({
        where: { user: { id: userId } },
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to fetch order', err.stack);
      throw err;
    }
  }

  /**
   * Create a new order
   * @param createOrderDto - The data to create the order with
   * @param userId - The ID of the user to create the order for
   * @returns Promise<Order> - The created order
   * @throws Error - If the order repository fails to create the order
   */
  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    try {
      const newOrder = this.orderRepo.create({
        ...createOrderDto,
        userId,
      });

      return await this.orderRepo.save(newOrder);
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to create order', err.stack);
      throw err;
    }
  }

  async orderProducts(userId: string) {
    try {
      const user = await this.usersService.findOne(userId);
      const cartItems = await this.cartsService.findUserCartItems(user.id);

      if (!cartItems || cartItems.length === 0) {
        return { message: 'You have no items in your cart' };
      }

      const cartItemWithProducts =
        await this.cartsService.findUserProductsFromCartByUserId(userId);

      const cartItemsWithProductsIsOrdered = cartItemWithProducts.filter(
        (item) => item.isOrdered,
      );
      const newOrder = await this.create(
        { shippingAddress: user.address },
        userId,
      );

      const orderItems = await Promise.all(
        cartItemsWithProductsIsOrdered.map((cartItem) => {
          return this.orderItemsService.create({
            order: newOrder,
            product: cartItem.product,
            quantity:
              cartItems.find((item) => item.productId === cartItem.product.id)
                ?.quantity ?? 1,
          });
        }),
      );
      const totalPrice = orderItems.reduce((acc, item) => {
        if (!item) return acc;
        return acc + Number(item.totalPrice);
      }, 0);

      const order = await this.findOne(newOrder.id);
      order.totalPrice = totalPrice;

      await this.orderRepo.save(order);

      for (const cartItem of cartItemsWithProductsIsOrdered) {
        await this.cartItemsService.remove(cartItem.id);
      }

      return orderItems;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to order products', err.stack);
      throw err;
    }
  }

  /**
   * Update an order
   * @param orderId - The ID of the order to update
   * @param updateOrderDto - The data to update the order with
   * @returns Promise<Order> - The updated order
   * @throws Error - If the order repository fails to update the order
   */
  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      const order = await this.findOne(orderId);

      const fieldsToUpdate = pickBy(
        updateOrderDto,
        (value) => value !== undefined,
      );

      Object.assign(order, fieldsToUpdate);
      return await this.orderRepo.save(order);
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to update order', err.stack);
      throw err;
    }
  }

  /**
   * Remove an order
   * @param orderId - The ID of the order to remove
   * @returns Promise<Order> - The removed order
   * @throws Error - If the order repository fails to remove the order
   */
  async remove(orderId: string): Promise<Order> {
    try {
      const order = await this.findOne(orderId);
      return await this.orderRepo.remove(order);
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to remove order', err.stack);
      throw err;
    }
  }
}
