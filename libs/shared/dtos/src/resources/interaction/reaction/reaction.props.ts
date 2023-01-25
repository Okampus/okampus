import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { ReactionType } from '@okampus/shared/enums';

@InputType()
export class ReactionProps {
  @Field(() => ReactionType)
  @IsEnum(ReactionType)
  reactionType!: ReactionType;
}
