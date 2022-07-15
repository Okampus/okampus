import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class AssigneesDto {
  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  assignees: string[];
}
