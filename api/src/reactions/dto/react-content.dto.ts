import { IsEnum } from 'class-validator';
import { AllReaction, AllReactionValue } from '../../shared/lib/types/enums/reaction.enum';

export class ReactContentDto {
  @IsEnum(AllReaction)
  reaction: AllReactionValue;
}
