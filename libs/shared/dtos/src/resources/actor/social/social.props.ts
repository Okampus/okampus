import { Field, InputType, Int } from '@nestjs/graphql';
import { SocialType } from '@okampus/shared/enums';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class SocialProps {
  @Field(() => SocialType)
  @IsEnum(SocialType)
  type!: SocialType;

  @Field(() => Int)
  @IsOptional()
  @IsNumber()
  order = 0;

  @Field(() => String)
  @IsString()
  url!: string;

  @Field(() => String)
  @IsString()
  pseudo!: string;
}
