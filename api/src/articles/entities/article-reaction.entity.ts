import {
  Entity,
  Enum,
  Index,
  ManyToOne,
} from '@mikro-orm/core';
import { Reaction } from '../../shared/modules/reaction/reaction.entity';
import { ArticleReaction as ArticleReactionEnum } from '../../shared/modules/reaction/reaction.enum';
import { User } from '../../users/user.entity';
import { Article } from './article.entity';

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
