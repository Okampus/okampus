import { IsDiff } from '../../../validators/diff.validator';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { IsJSON } from 'class-validator';
import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class FormEditProps {
  @Field(() => GraphQLJSON) // TODO: calculate diff on server
  @IsDiff()
  addedDiff!: JSONObject;

  @Field(() => GraphQLJSON)
  @IsJSON() // TODO: form schema validation
  newVersion!: JSONObject;
}
