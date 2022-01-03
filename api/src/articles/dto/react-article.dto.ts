import { IsEnum } from 'class-validator';
import { ArticleReaction } from '../../shared/modules/reaction/reaction.enum';

export class ReactArticleDto {
  @IsEnum(ArticleReaction)
  reaction: ArticleReaction;
}
