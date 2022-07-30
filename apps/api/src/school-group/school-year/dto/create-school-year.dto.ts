import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class CreateSchoolYearDto {
  @Field()
  @Length(1, 100)
  @IsString()
  id: string;

  @Field()
  @Length(1, 100)
  @IsString()
  name: string;
}
