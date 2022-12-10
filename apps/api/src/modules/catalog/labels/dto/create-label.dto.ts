import { Field } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LabelType } from '@lib/types/enums/label-type.enum';

export class CreateLabelDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  id: string;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  image: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  tooltip: string;

  @Field(() => LabelType)
  @IsEnum(LabelType)
  type: LabelType;
}
