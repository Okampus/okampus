import { Field, InputType } from '@nestjs/graphql';
import { SocialType } from '@okampus/shared/enums';
import { IsEnum, IsString } from 'class-validator';

@InputType()
export class SocialProps {
  @Field(() => SocialType)
  @IsEnum(SocialType)
  type!: SocialType;

  @Field(() => String)
  @IsString()
  url!: string;

  @Field(() => String)
  @IsString()
  pseudo!: string;
}
