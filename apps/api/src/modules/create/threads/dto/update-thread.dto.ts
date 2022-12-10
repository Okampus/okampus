import {
  Field,
  InputType,
  Int,
  PartialType,
} from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { CreateThreadDto } from '@create/threads/dto/create-thread.dto';

@InputType()
export class UpdateThreadDto extends PartialType(CreateThreadDto) {
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  validatedWithContent?: number;
}
