import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class ContentProps {
  @Field(() => String)
  @Length(1, 20_000)
  @IsString()
  text!: string;
}
