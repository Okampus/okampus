import { IsEnum } from 'class-validator';
import { AllReaction } from '../../../../shared/lib/types/enums/reaction.enum';

export class ReactContentDto {
  @IsEnum(AllReaction)
  reaction: AllReaction;
}
