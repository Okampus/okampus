import { IsEnum } from 'class-validator';
import { AllReaction, AllReactionValue } from '../reaction.enum';

export class ReactContentDto {
  @IsEnum(AllReaction)
  reaction: AllReactionValue;
}
