import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { Snowflake } from '@okampus/shared/types';
import { IsOptional, IsString } from 'class-validator';
import { ActorProps } from '../../actor/actor.props';
import { TeamProps } from './team.props';

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
