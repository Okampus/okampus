import { ProjectProps } from './project.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProjectDto extends ProjectProps {
  @Field(() => String)
  @IsString() // TODO: create custom validator for UUID
  teamId!: string;

  @Field(() => [String])
  @IsString({ each: true })
  @IsOptional()
  eventIds: string[] = [];

  @Field(() => [String])
  @IsString({ each: true })
  supervisorIds: string[] = [];

  @Field(() => [String])
  @IsString({ each: true })
  participantsIds: string[] = [];
}
