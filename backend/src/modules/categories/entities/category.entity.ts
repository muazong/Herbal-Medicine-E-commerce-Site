import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../database/abstract.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'categories' })
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Product, (product) => product.category, { cascade: true })
  products: Product[];
}
