import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@InputType()
export class CreateOrphanContentDto {
  @Field()
  @Length(10, 10_000)
  @IsString()
  body: string;

  @Field(() => Boolean)
  @IsBoolean()
  isAnonymous = false;
}
