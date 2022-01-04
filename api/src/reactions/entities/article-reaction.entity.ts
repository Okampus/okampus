import {
  Entity,
  Enum,
  Index,
  ManyToOne,
} from '@mikro-orm/core';
import { Article } from '../../articles/entities/article.entity';
import { User } from '../../users/user.entity';
import { ArticleReaction as ArticleReactionEnum } from '../reaction.enum';
import { Reaction } from './reaction.entity';

@Entity()
export class ArticleReaction extends Reaction {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  article!: Article;

  @Enum()
  @Index()
  value!: ArticleReactionEnum;

  constructor(article: Article, user: User, value: ArticleReactionEnum) {
    super(user);
    this.article = article;
    this.value = value;
  }
}
