import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { QueryOrderMapScalar } from '@okampus/shared/graphql';
import type { QueryOrder } from '@mikro-orm/core';

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
