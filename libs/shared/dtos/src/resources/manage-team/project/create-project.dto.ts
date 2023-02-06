import { ProjectProps } from './project.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateProjectDto extends ProjectProps {
  @Field(() => String)
  @IsString() // TODO: create custom validator for UUID
  teamId!: Snowflake;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  linkedEventId: Snowflake | null = null;

  @Field(() => String)
  @IsString()
  supervisorId!: Snowflake;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  participantsIds: Snowflake[] = [];
}
