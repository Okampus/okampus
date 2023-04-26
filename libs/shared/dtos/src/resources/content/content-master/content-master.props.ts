import { Field, InputType } from '@nestjs/graphql';
import { ContentMasterType } from '@okampus/shared/enums';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';

@InputType()
export class ContentMasterProps {
  @Field(() => ContentMasterType)
  @IsEnum(ContentMasterType)
  type!: ContentMasterType;

  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @Length(1, 100)
  @Matches(/^[\d:a-z-]+$/)
  @IsOptional()
  @IsString()
  slug?: string;
}
