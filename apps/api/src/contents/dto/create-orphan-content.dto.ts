import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class CreateOrphanContentDto {
  @Field()
  @Length(10, 10_000)
  @IsString()
  body: string;
}
