import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { CartItem } from '../../cart-items/entities/cart-item.entity';

@Entity({ name: 'carts' })
export class Cart extends AbstractEntity<Cart> {
  @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { nullable: true })
  cartItems?: CartItem[];
}
