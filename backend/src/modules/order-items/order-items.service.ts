import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  private readonly logger = new Logger(OrderItemsService.name);

  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    try {
      const newOrderItem = this.orderItemRepo.create({
        product: createOrderItemDto.product,
        order: createOrderItemDto.order,
        quantity: createOrderItemDto.quantity,
        totalPrice:
          createOrderItemDto.quantity * createOrderItemDto.product.price,
      });

      return await this.orderItemRepo.save(newOrderItem);
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to create order item', err.stack);
      throw err;
    }
  }
}
