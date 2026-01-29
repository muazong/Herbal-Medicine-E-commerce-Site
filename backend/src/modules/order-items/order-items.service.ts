import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderStatus } from '../../common/enums';

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

  async countProductsByStatus(status: OrderStatus): Promise<number> {
    const result = await this.orderItemRepo
      .createQueryBuilder('oi')
      .innerJoin('oi.order', 'o')
      .where('o.status = :status', { status })
      .select('COALESCE(SUM(oi.quantity), 0)', 'total')
      .getRawOne();

    return Number(result.total);
  }

  async getMonthlyRevenue(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const items = await this.orderItemRepo
      .createQueryBuilder('oi')
      .innerJoin('oi.order', 'o')
      .innerJoin('oi.product', 'p')
      .where('o.status = :status', { status: 'delivered' })
      .andWhere('o.createdAt >= :startDate', { startDate })
      .andWhere('o.createdAt < :endDate', { endDate })
      .select(['oi.quantity AS quantity', 'p.price AS price'])
      .getRawMany();

    return items.reduce((total, item) => {
      return total + Number(item.quantity) * Number(item.price);
    }, 0);
  }
}
