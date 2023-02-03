import { Field, InputType } from '@nestjs/graphql';
import { Snowflake } from '@okampus/shared/types';
import { IsOptional, IsString } from 'class-validator';
import { FinanceProps } from './finance.props';

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
