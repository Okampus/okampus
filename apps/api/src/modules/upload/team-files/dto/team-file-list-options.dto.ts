import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationArgs } from '@common/modules/pagination';

@InputType()
export class TeamFileListOptions extends PaginationArgs {
  @Field(() => Int)
  @IsOptional()
  @IsInt()
  id?: number;

  @Field()
  @IsOptional()
  @IsString()
  type?: string;

  @Field(() => Boolean)
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
