import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { BotRole } from '@okampus/shared/enums';

@InputType()
export class BotProps {
  @Field(() => BotRole)
  @IsEnum(BotRole)
  botRole!: BotRole;
}
