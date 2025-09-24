import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { PaymentMethods } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderItem } from '../../order-items/entities/order-item.entity';

@Entity({ name: 'orders' })
export class Order extends AbstractEntity<Order> {
  @ManyToOne(() => User, (user) => user.order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  userId: string;

  @Column({ nullable: true })
  shippingAddress?: string;

  @Column({ type: 'enum', enum: PaymentMethods, default: PaymentMethods.CASH })
  paymentMethod: PaymentMethods;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
    cascade: true,
  })
  orderItems: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;
}
