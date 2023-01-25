import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

@InputType()
export class DocumentProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String)
  @IsOptional()
  @Length(1, 10_000)
  @IsString()
  description?: string;

  @Field(() => Int)
  @Min(1970)
  @Max(2100) // TODO: Make this dynamic
  @IsInt()
  yearVersion!: number;
}
