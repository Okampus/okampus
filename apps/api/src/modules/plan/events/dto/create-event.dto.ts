import {
  Field,
  Float,
  GraphQLISODateTime,
  InputType,
  Int,
} from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';
import { EventState } from '@lib/types/enums/event-state.enum';

@InputType()
export class CreateEventDto {
  @Field(() => GraphQLISODateTime)
  @IsDate()
  start: Date;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  end: Date;

  @Field()
  @IsString()
  @Length(5, 150)
  name: string;

  @Field()
  @IsString()
  @Length(5, 3000)
  description: string;

  @Field()
  @IsString()
  @Length(5, 500)
  location: string;

  @Field(() => Float)
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @Field(() => Boolean)
  @IsOptional()
  @IsBoolean()
  private = false;

  @Field(() => EventState)
  @IsOptional()
  @IsIn([EventState.Draft, EventState.Template, EventState.Submitted])
  state?: EventState;

  @Field()
  @IsString()
  @IsOptional()
  supervisorId?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  formId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  templateId?: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  meta?: object[] | object;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  eventApprovalSubmission?: object[] | object;
}
