import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../database/abstract.entity';
import { Category } from '../../categories/entities/category.entity';
import { Media } from '../../media/entities/media.entity';
import { CartItem } from '../../cart-items/entities/cart-item.entity';

@Entity({ name: 'products' })
export class Product extends AbstractEntity<Product> {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  sold: number;

  @OneToMany(() => Media, (media) => media.product, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  media: Media[] | null;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn()
  category: Category | null;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];
}
