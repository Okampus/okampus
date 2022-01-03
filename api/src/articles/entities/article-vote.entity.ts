import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { VoteBase } from '../../shared/modules/vote/vote-base.entity';
import { User } from '../../users/user.entity';
import { Article } from './article.entity';

@Entity()
export class ArticleVote extends VoteBase {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  article!: Article;

  constructor(article: Article, user: User, value: -1 | 1) {
    super(user, value);
    this.article = article;
  }
}
