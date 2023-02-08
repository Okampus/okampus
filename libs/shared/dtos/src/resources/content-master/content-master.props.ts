import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class ContentMasterProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  title!: string;

  @Field(() => String)
  @Length(1, 100)
  @IsString()
  slug!: string;
}
