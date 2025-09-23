import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Cart } from '../../carts/entities/cart.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'cart_items' })
export class CartItem extends AbstractEntity<CartItem> {
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  cart: Cart;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @Column()
  quantity: number;
}
