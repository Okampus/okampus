import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CampusProps {
  @Field(() => String)
  @IsString()
  name!: string;
}
