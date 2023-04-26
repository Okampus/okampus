import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { IsJSON } from 'class-validator';
import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class FormEditProps {
  @Field(() => GraphQLJSON)
  @IsJSON() // TODO: form schema validation
  newVersion!: JSONObject;
}
