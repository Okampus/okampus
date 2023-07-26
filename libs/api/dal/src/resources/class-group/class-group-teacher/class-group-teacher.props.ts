import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';

@InputType()
export class ClassGroupTeacherProps {
  @Field(() => GraphQLISODateTime)
  @IsDate()
  startDate!: Date;

  @Field(() => GraphQLISODateTime)
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
