import { BotProps } from './bot.props';
import { ActorProps } from '../actor.props';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import type {} from '@nestjs/common';

@InputType()
export class CreateBotDto extends IntersectionType(BotProps, ActorProps) {
  @Field(() => String)
  @IsString()
  ownerSlug!: string;
}
