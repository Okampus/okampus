import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class TagsDto {
  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
