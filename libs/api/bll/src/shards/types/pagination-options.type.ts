import type { QueryOrder } from '@mikro-orm/core';
import { Field, InputType, Int } from '@nestjs/graphql';
import { QueryOrderMapScalar } from '@okampus/shared/types';
import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class PaginationOptions {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  after?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  before?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @Field(() => QueryOrderMapScalar, { nullable: true })
  @IsOptional()
  @IsObject()
  orderBy?: Record<string, QueryOrder>;
}
