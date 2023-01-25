import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';

@InputType()
export class DocumentEditProps {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  yearVersion?: number;
}
