import { ProjectProps } from './project.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateProjectDto extends ProjectProps {
  @Field(() => String)
  @IsString() // TODO: create custom validator for UUID
  teamId!: Snowflake;

  @Field(() => [String])
  @IsString({ each: true })
  @IsOptional()
  eventIds: Snowflake[] = [];

  @Field(() => [String])
  @IsString({ each: true })
  supervisorIds: Snowflake[] = [];

  @Field(() => [String])
  @IsString({ each: true })
  participantsIds: Snowflake[] = [];
}
