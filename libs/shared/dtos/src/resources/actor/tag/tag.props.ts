import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Colors } from '@okampus/shared/enums';

@InputType()
export class TagProps {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 50)
  @Matches(/^[\d:a-z-]+$/)
  @IsString()
  slug?: string;

  @Field(() => String)
  @Length(1, 50)
  @IsString()
  name!: string;

  @Field(() => Colors, { nullable: true })
  @IsOptional()
  @IsEnum(Colors)
  color?: Colors;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string = '';
}
