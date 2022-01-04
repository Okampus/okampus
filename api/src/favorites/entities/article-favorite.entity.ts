import { Entity, Index, OneToOne } from '@mikro-orm/core';
import { Article } from '../../articles/entities/article.entity';
import { User } from '../../users/user.entity';
import { Favorite } from './favorite.entity';

@Entity({ discriminatorValue: 'article' })
export class ArticleFavorite extends Favorite {
  @OneToOne({ onDelete: 'CASCADE' })
  @Index()
  article!: Article;

  constructor(article: Article, user: User) {
    super(user);
    this.article = article;
  }
}
