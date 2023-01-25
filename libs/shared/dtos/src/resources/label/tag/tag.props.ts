import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Colors } from '@okampus/shared/enums';

@InputType()
export class TagProps {
  @Field(() => String)
  @Length(1, 50)
  @Matches(/^[\d:a-z-]+$/)
  @IsString()
  name!: string;

  @Field(() => Colors)
  @IsEnum(Colors)
  color!: Colors;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;
}
