import { BotProps } from './bot.props';
import { ActorProps } from '../../actor/actor.props';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateBotDto extends IntersectionType(BotProps, ActorProps) {
  @Field(() => String)
  @IsString()
  ownerSlug!: string;
}
