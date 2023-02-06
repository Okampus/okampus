import { FinanceProps } from './finance.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateFinanceDto extends FinanceProps {
  // TODO: manage document upload
  @Field(() => String)
  @IsString() // TODO: create custom validator for UUID
  teamId!: Snowflake;

  @Field(() => String, { nullable: true })
  @IsString() // TODO: create custom validator for UUID
  @IsOptional()
  linkedEventId: Snowflake | null = null;

  @Field(() => String, { nullable: true })
  @IsString() // TODO: create custom validator for UUID
  @IsOptional()
  linkedProjectId: Snowflake | null = null;
}
