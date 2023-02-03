import { Field, InputType } from '@nestjs/graphql';
import { SubjectType } from '@okampus/shared/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class SubjectProps {
  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  englishName?: string;

  @Field(() => String)
  @IsString()
  code!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => SubjectType)
  @IsEnum(SubjectType)
  type!: SubjectType;
}
