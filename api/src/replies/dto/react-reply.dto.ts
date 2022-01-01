import { IsEnum } from 'class-validator';
import { ReplyReaction } from '../../shared/modules/reaction/reaction.enum';

export class ReactReplyDto {
  @IsEnum(ReplyReaction)
  reaction: ReplyReaction;
}
