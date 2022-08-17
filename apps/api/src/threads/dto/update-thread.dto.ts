import {
  Field,
  InputType,
  Int,
  PartialType,
} from '@nestjs/graphql';
import {
 IsBoolean, IsInt, IsOptional, IsString,
} from 'class-validator';
import { CreateThreadDto } from './create-thread.dto';

@InputType()
export class UpdateThreadDto extends PartialType(CreateThreadDto) {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  validatedWithContent?: number;
}
