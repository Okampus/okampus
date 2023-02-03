import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { FormType } from '@okampus/shared/enums';
import { JSONObject } from '@okampus/shared/types';
import { IsBoolean, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { IsFormKitSchema } from '../../../validators/formkit-schema.validator';

@InputType()
export class FormProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String)
  @IsOptional()
  @Length(1, 10_000)
  @IsString()
  description?: string | null;

  @Field(() => GraphQLJSON)
  @IsFormKitSchema()
  schema!: JSONObject;

  @Field(() => FormType)
  @IsEnum(FormType)
  type!: FormType;

  @Field(() => Boolean)
  @IsBoolean()
  isTemplate!: boolean;
}
