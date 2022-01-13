import { Entity, Index, OneToOne } from '@mikro-orm/core';
import { Article } from '../../articles/entities/article.entity';
import type { User } from '../../users/user.entity';
import { Report } from './report.entity';

@Entity({ discriminatorValue: 'article' })
export class ArticleReport extends Report {
  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  article!: Article;

  constructor(options: {
    article: Article;
    user: User;
    reason: string;
  }) {
    super(options);
    this.article = options.article;
  }
}
