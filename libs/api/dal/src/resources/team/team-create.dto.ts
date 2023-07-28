import { TeamProps } from './team.props';
import { ActorProps } from '../actor/actor.props';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTeamDto extends IntersectionType(TeamProps, ActorProps) {
  @Field(() => String, { nullable: true })
  @IsString() // TODO: create custom validator for UUID
  @IsOptional()
  ownerId?: string;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  categoriesIds: string[] = [];
}
