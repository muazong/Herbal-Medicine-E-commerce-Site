import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../database/abstract.entity';
import { Category } from '../../categories/entities/category.entity';
import { Media } from '../../media/entities/media.entity';

@Entity({ name: 'products' })
export class Product extends AbstractEntity<Product> {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

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
}
