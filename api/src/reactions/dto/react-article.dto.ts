import { IsEnum } from 'class-validator';
import { ArticleReaction } from '../reaction.enum';

export class ReactArticleDto {
  @IsEnum(ArticleReaction)
  reaction: ArticleReaction;
}
