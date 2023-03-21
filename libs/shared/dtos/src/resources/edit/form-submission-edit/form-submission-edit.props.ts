import { Field, InputType } from '@nestjs/graphql';
import { IsJSON } from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';

import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class FormSubmissionEditProps {
  @Field(() => GraphQLJSON)
  @IsJSON() // TODO: form schema validation
  newVersion!: JSONObject;
}
