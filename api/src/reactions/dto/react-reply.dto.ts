import { IsEnum } from 'class-validator';
import { ReplyReaction } from '../reaction.enum';

export class ReactReplyDto {
  @IsEnum(ReplyReaction)
  reaction: ReplyReaction;
}
