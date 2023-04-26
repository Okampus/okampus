import { TeamProps } from './team.props';
import { ActorProps } from '../actor/actor.props';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateTeamDto extends IntersectionType(TeamProps, ActorProps) {
  @Field(() => String, { nullable: true })
  @IsString() // TODO: create custom validator for UUID
  @IsOptional()
  ownerId?: Snowflake;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  categoriesIds: Snowflake[] = [];
}
