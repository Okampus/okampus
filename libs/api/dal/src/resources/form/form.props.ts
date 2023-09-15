import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { IsBoolean, IsOptional } from 'class-validator';

import type { FormSchema } from '@okampus/shared/types';

@InputType()
export class FormProps {
  @Field(() => GraphQLJSON)
  schema!: FormSchema;

  @Field(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isAllowingMultipleAnswers?: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isAllowingEditingAnswers?: boolean;
}
