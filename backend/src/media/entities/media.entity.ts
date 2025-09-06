import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity';

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

  @Column()
  type: 'avatar' | 'cover' | 'product';
}
