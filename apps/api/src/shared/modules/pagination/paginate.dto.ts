import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class PaginateDto {
  @Field(() => Int)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  @Min(1)
  itemsPerPage?: number;
}
