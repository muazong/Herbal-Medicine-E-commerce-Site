import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity';
import { MediaType } from '../../../common/enums';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'media' })
export class Media extends AbstractEntity<Media> {
  @Column()
  path: string;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column({ type: 'enum', enum: MediaType })
  type: MediaType;

  @ManyToOne(() => Product, (product) => product.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  // TODO: Add relationship
  /* @ManyToOne(() => Category, (category) => category.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: Category; */
}
