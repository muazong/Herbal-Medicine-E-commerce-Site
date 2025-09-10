import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity';
import { MediaType } from '../../../common/enums';

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
}
