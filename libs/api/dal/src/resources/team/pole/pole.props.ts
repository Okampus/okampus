import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, Length } from 'class-validator';
import { PoleCategory } from '@okampus/shared/enums';

@InputType()
export class PoleProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String)
  @Length(1, 10_000)
  @IsString()
  description!: string;

  @Field(() => PoleCategory)
  @IsEnum(PoleCategory)
  category!: PoleCategory;
}
