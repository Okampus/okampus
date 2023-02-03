import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsObject, IsString } from 'class-validator';
import { SessionClientType } from '@okampus/shared/enums';
import { GraphQLJSON } from 'graphql-scalars';
import { JSONObject } from '@okampus/shared/types';

@InputType()
export class SessionProps {
  @Field(() => String)
  @IsString()
  ip!: string;

  @Field(() => String)
  @IsString()
  country!: string;

  @Field(() => SessionClientType)
  @IsEnum(SessionClientType)
  clientType!: SessionClientType;

  @Field(() => GraphQLJSON)
  @IsObject()
  userAgent!: JSONObject;
}
