import { Field, InputType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';
import { IsOptional, IsString } from 'class-validator';
import { ProjectProps } from './project.props';

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
