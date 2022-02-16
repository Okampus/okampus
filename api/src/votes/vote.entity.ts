import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Content } from '../contents/entities/content.entity';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { User } from '../users/user.entity';

@Entity()
export class Vote extends BaseEntity {
  @PrimaryKey()
  voteId!: number;

  @Enum()
  value!: -1 | 1;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  content: Content;

  constructor(options: {
    user: User;
    content: Content;
    value: -1 | 1;
  }) {
    super();
    this.user = options.user;
    this.content = options.content;
    this.value = options.value;
  }
}

export interface NoVote {
  value: 0;
  user: User;
  content: Content;
}
