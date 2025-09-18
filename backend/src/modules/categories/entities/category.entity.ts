import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { Media } from '../../media/entities/media.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'categories' })
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToOne(() => Media, { nullable: true, eager: true })
  @JoinColumn()
  image: Media | null;

  @OneToMany(() => Product, (product) => product.category, { cascade: true })
  products: Product[];
}
