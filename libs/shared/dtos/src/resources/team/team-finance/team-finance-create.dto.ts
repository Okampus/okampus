import { TeamFinanceProps } from './team-finance.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTeamFinanceDto extends TeamFinanceProps {
  // TODO: manage document upload
  @Field(() => String)
  @IsString() // TODO: create custom validator for UUID
  teamId!: string;

  @Field(() => String, { nullable: true })
  @IsString() // TODO: create custom validator for UUID
  @IsOptional()
  eventId: string | null = null;

  @Field(() => String, { nullable: true })
  @IsString() // TODO: create custom validator for UUID
  @IsOptional()
  projectId: string | null = null;
}
