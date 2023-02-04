import { IsDiff } from '../../../validators/diff.validator';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { IsOptional, IsString } from 'class-validator';
import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class ContentEditProps {
  @Field(() => GraphQLJSON)
  @IsDiff()
  addedDiff!: JSONObject;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  note?: string;
}
