import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { AccountStatus, Role, UserProvider } from '../../common/enums';
import { AbstractEntity } from '../../database/abstract.entity';
import { Media } from '../../media/entities/media.entity';

@Entity({ name: 'users' })
export class User extends AbstractEntity<User> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: uuidv4() })
  password: string;

  @Column({ nullable: true })
  address?: string;

  @OneToOne(() => Media, { eager: true, nullable: true })
  @JoinColumn()
  avatar: Media | null;

  @OneToOne(() => Media, { eager: true, nullable: true })
  @JoinColumn()
  cover: Media | null;

  @Column({ type: 'enum', enum: UserProvider, default: UserProvider.LOCAL })
  provider: UserProvider;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @BeforeInsert()
  @BeforeUpdate()
  generateFullNameOnUpdate(): void {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
