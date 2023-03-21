import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class ContentEditProps {
  @Field(() => String)
  @IsString()
  newVersion!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  note?: string | null;
}
