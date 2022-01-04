import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../../users/user.entity';

@Entity({
  discriminatorColumn: 'kind',
  abstract: true,
})
export abstract class Favorite extends BaseEntity {
  @PrimaryKey()
  favoriteId!: number;

  @Enum()
  @Exclude()
  kind!: 'article' | 'comment' | 'post' | 'reply';

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  constructor(user: User) {
    super();
    this.user = user;
  }
}
