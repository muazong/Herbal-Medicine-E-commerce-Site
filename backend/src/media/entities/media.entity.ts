import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity';

@Entity({ name: 'media' })
export class Media extends AbstractEntity<Media> {
  constructor(partial?: Partial<Media>) {
    super(partial!);
    if (partial) {
      Object.assign(this, partial);
    }
  }

  @Column()
  path: string;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;
}
