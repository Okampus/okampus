import { Field, InputType } from '@nestjs/graphql';
import {
 IsEnum, IsOptional, IsString, Length,
} from 'class-validator';
import { SchoolGroupType } from '../../shared/lib/types/enums/school-group-type.enum';

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

  @Field(() => SchoolGroupType, { nullable: true })
  @IsOptional()
  @IsEnum(SchoolGroupType)
  type?: SchoolGroupType;

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
