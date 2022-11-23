import { Field, InputType } from '@nestjs/graphql';
import {
 IsEnum, IsOptional, IsString, Length,
} from 'class-validator';
import { ClassType } from '@common/lib/types/enums/class-type.enum';

@InputType()
export class CreateClassDto {
  @Field()
  @Length(1, 100)
  @IsString()
  id: string;

  @Field()
  @Length(1, 100)
  @IsString()
  name: string;

  @Field(() => ClassType, { nullable: true })
  @IsOptional()
  @IsEnum(ClassType)
  type?: ClassType;

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
