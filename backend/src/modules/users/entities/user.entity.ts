import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  Unique,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Cart } from '../../carts/entities/cart.entity';
import { Media } from '../../media/entities/media.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { AccountStatus, Role, UserProvider } from '../../../common/enums';
import { Order } from '../../orders/entities/order.entity';

@Entity({ name: 'users' })
@Unique(['email', 'provider'])
export class User extends AbstractEntity<User> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ default: uuidv4() })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, length: 255 })
  address?: string;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  order: Order;

  @OneToOne(() => Media, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn()
  avatar: Media | null;

  @OneToOne(() => Media, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn()
  cover: Media | null;

  @Column({ type: 'enum', enum: UserProvider, default: UserProvider.LOCAL })
  provider: UserProvider;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @BeforeInsert()
  @BeforeUpdate()
  generateFullNameOnUpdate(): void {
    this.fullName = `${this.firstName.trim()} ${this.lastName.trim()}`;
  }
}
