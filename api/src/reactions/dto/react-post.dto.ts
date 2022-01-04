import { IsEnum } from 'class-validator';
import { PostReaction } from '../reaction.enum';

export class ReactPostDto {
  @IsEnum(PostReaction)
  reaction: PostReaction;
}
