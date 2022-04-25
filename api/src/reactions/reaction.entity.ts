import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Content } from '../contents/entities/content.entity';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { AllReaction, AllReactionValue } from '../shared/lib/types/enums/reaction.enum';
import { User } from '../users/user.entity';

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
