import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Content } from '../contents/content.entity';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { User } from '../users/user.entity';
import { AllReaction, AllReactionValue } from './reaction.enum';

@Entity()
export class Reaction extends BaseEntity {
  @PrimaryKey()
  reactionId!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  content!: Content;

  @Enum(() => AllReaction)
  @Index()
  value!: AllReactionValue;

  constructor(options: {
    user: User;
    content: Content;
    value: AllReactionValue;
  }) {
    super();
    this.user = options.user;
    this.content = options.content;
    this.value = options.value;
  }
}
