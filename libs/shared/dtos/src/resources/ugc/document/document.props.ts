import { UgcProps } from '../ugc.props';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

@InputType()
export class DocumentProps extends UgcProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 10_000)
  @IsString()
  description?: string | null = null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1970)
  @Max(2100) // TODO: Make this dynamic
  @IsInt()
  yearVersion?: number | null = null;
}
