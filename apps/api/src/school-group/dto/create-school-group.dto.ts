import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class CreateSchoolGroupDto {
  @Field()
  @Length(1, 100)
  @IsString()
  id: string;

  @Field()
  @Length(1, 100)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @Length(1, 100)
  @IsOptional()
  @IsString()
  englishName?: string | null;

  @Field(() => String, { nullable: true })
  @Length(1, 100)
  @IsOptional()
  @IsString()
  parentId?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;
}