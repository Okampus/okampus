import {
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Content } from '../contents/entities/content.entity';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { User } from '../users/user.entity';

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryKey()
  favoriteId!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  content!: Content;

  constructor(options: {
    user: User;
    content: Content;
  }) {
    super();
    this.user = options.user;
    this.content = options.content;
  }
}
