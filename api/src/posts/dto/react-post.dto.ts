import { IsEnum } from 'class-validator';
import { PostReaction } from '../../shared/modules/reaction/reaction.enum';

export class ReactPostDto {
  @IsEnum(PostReaction)
  reaction: PostReaction;
}
